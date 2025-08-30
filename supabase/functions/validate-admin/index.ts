
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Admin validation function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders
    })
  }

  try {
    const { secret } = await req.json()
    console.log('Received secret validation request');
    
    if (!secret) {
      return new Response(
        JSON.stringify({ valid: false, error: 'No secret provided' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get the admin secret from Supabase secrets
    const adminSecret = Deno.env.get('ADMIN_SECRET_KEY')
    console.log('Admin secret configured:', !!adminSecret);
    
    if (!adminSecret) {
      console.error('ADMIN_SECRET_KEY not configured')
      return new Response(
        JSON.stringify({ valid: false, error: 'Server configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const isValid = secret === adminSecret
    console.log('Secret validation result:', isValid);

    return new Response(
      JSON.stringify({ valid: isValid }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error validating admin secret:', error)
    return new Response(
      JSON.stringify({ valid: false, error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
