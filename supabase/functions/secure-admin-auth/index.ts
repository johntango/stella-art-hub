import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHash } from "https://deno.land/std@0.168.0/hash/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AdminAuthRequest {
  action: 'login' | 'verify' | 'logout' | 'cleanup';
  secret?: string;
  sessionToken?: string;
  userAgent?: string;
}

const logStep = (step: string, data?: any) => {
  console.log(`[Secure Admin Auth] ${step}`, data ? JSON.stringify(data) : '');
};

const getClientIP = (req: Request): string => {
  return req.headers.get('x-forwarded-for') || 
         req.headers.get('x-real-ip') || 
         'unknown';
};

const generateSessionToken = (): string => {
  const hash = createHash("sha256");
  hash.update(crypto.getRandomValues(new Uint8Array(32)));
  hash.update(Date.now().toString());
  return hash.toString();
};

serve(async (req) => {
  logStep('Secure admin auth function called', { method: req.method });
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { action, secret, sessionToken, userAgent }: AdminAuthRequest = await req.json();
    const clientIP = getClientIP(req);

    logStep('Processing action', { action, clientIP });

    switch (action) {
      case 'login': {
        if (!secret) {
          return new Response(
            JSON.stringify({ success: false, error: 'Secret required' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Check rate limiting - convert string IP to proper format for inet type
        const { data: rateLimitOk, error: rateLimitError } = await supabase.rpc('check_rate_limit', {
          ip: clientIP,
          max_attempts: 5,
          window_minutes: 15
        });

        if (rateLimitError) {
          logStep('Rate limit check error', rateLimitError);
          // Continue without rate limiting if there's an error
        }

        if (!rateLimitOk) {
          // Log failed attempt
          await supabase.from('admin_login_attempts').insert({
            ip_address: clientIP,
            success: false,
            user_agent: userAgent
          });

          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Too many failed attempts. Please try again later.' 
            }),
            { 
              status: 429,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Validate admin secret
        const adminSecret = Deno.env.get('ADMIN_SECRET_KEY');
        const isValidSecret = secret === adminSecret;

        // Log login attempt
        await supabase.from('admin_login_attempts').insert({
          ip_address: clientIP,
          success: isValidSecret,
          user_agent: userAgent
        });

        if (!isValidSecret) {
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid credentials' }),
            { 
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Create session token (valid for 8 hours)
        const sessionTokenValue = generateSessionToken();
        const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours

        // For now, we'll use a system user ID until proper admin user creation
        // In production, you should create actual admin users in auth.users
        const systemUserId = '00000000-0000-0000-0000-000000000000';

        const { error: sessionError } = await supabase
          .from('admin_sessions')
          .insert({
            user_id: systemUserId,
            session_token: sessionTokenValue,
            expires_at: expiresAt.toISOString(),
            ip_address: clientIP,
            user_agent: userAgent
          });

        if (sessionError) {
          logStep('Session creation error', sessionError);
          throw sessionError;
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            sessionToken: sessionTokenValue,
            expiresAt: expiresAt.toISOString()
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      case 'verify': {
        if (!sessionToken) {
          return new Response(
            JSON.stringify({ success: false, error: 'Session token required' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        const { data: userId } = await supabase.rpc('validate_admin_session', {
          token: sessionToken
        });

        if (!userId) {
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid or expired session' }),
            { 
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Update last used time
        await supabase
          .from('admin_sessions')
          .update({ last_used_at: new Date().toISOString() })
          .eq('session_token', sessionToken);

        return new Response(
          JSON.stringify({ success: true, userId }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      case 'logout': {
        if (!sessionToken) {
          return new Response(
            JSON.stringify({ success: false, error: 'Session token required' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        await supabase
          .from('admin_sessions')
          .delete()
          .eq('session_token', sessionToken);

        return new Response(
          JSON.stringify({ success: true }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      case 'cleanup': {
        await supabase.rpc('cleanup_expired_sessions');
        
        return new Response(
          JSON.stringify({ success: true, message: 'Cleanup completed' }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid action' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
    }
  } catch (error) {
    logStep('Error in secure admin auth', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});