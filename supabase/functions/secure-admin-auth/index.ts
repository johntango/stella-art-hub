import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

const generateSessionToken = async (): Promise<string> => {
  // Generate random bytes
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const timestamp = new TextEncoder().encode(Date.now().toString());
  
  // Combine random bytes and timestamp
  const combined = new Uint8Array(randomBytes.length + timestamp.length);
  combined.set(randomBytes);
  combined.set(timestamp, randomBytes.length);
  
  // Hash using Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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

        // Check rate limiting - be more lenient for testing
        try {
          const { data: rateLimitOk } = await supabase.rpc('check_rate_limit', {
            ip: clientIP,
            max_attempts: 10, // Increased from 5 to 10
            window_minutes: 15
          });

          if (!rateLimitOk) {
            logStep('Rate limit exceeded', { clientIP, userAgent });
            
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
        } catch (rateLimitError) {
          logStep('Rate limit check failed, allowing request', rateLimitError);
          // If rate limiting fails, allow the request to proceed
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
        const sessionTokenValue = await generateSessionToken();
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