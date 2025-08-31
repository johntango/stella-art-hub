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
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfIP = req.headers.get('cf-connecting-ip');
  
  // Take only the first IP address if multiple are present
  const rawIP = cfIP || realIP || forwarded || '127.0.0.1';
  let cleanIP = rawIP.split(',')[0].trim();
  
  // Validate IP format - if invalid, use localhost
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (!ipRegex.test(cleanIP)) {
    cleanIP = '127.0.0.1';
  }
  
  console.log('🔍 IP Resolution:', { forwarded, realIP, cfIP, rawIP, cleanIP });
  return cleanIP;
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

        // Temporarily disable rate limiting for debugging
        logStep('Rate limiting temporarily disabled for debugging');

        // Validate the admin secret
        const adminSecret = Deno.env.get('ADMIN_SECRET_KEY');
        const isValidSecret = adminSecret && secret === adminSecret;

        // Log login attempt
        console.log('💾 Logging attempt:', { ip_address: clientIP, success: isValidSecret, user_agent: userAgent });
        
        try {
          const { error: logError } = await supabase.from('admin_login_attempts').insert({
            ip_address: clientIP,
            success: isValidSecret,
            user_agent: userAgent
          });
          
          if (logError) {
            console.error('❌ Failed to log login attempt:', logError);
          }
        } catch (insertError) {
          console.error('❌ Exception logging login attempt:', insertError);
        }

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

        // Use the actual admin user ID from the database
        const { data: adminUser } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin')
          .single();
        
        if (!adminUser) {
          throw new Error('No admin user found');
        }
        
        const systemUserId = adminUser.user_id;

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
          console.error('🔥 Full session error details:', JSON.stringify(sessionError, null, 2));
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