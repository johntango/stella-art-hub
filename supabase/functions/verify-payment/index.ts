import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use the service role key to perform writes in Supabase
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const { sessionId } = await req.json();
    if (!sessionId) {
      throw new Error("Session ID is required");
    }
    logStep("Received session ID", { sessionId });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { 
      apiVersion: "2023-10-16" 
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Retrieved Stripe session", { 
      status: session.payment_status, 
      customerEmail: session.customer_email 
    });

    if (session.payment_status !== 'paid') {
      throw new Error("Payment not completed");
    }

    // Get customer details
    const customerEmail = session.customer_email || session.customer_details?.email;
    if (!customerEmail) {
      throw new Error("Customer email not found");
    }

    // Determine subscription tier from the session
    let subscriptionTier = "Regular";
    if (session.amount_total) {
      const amount = session.amount_total;
      if (amount <= 20000) { // $200 or less
        subscriptionTier = "Student";
      } else if (amount >= 59900) { // $599 or more
        subscriptionTier = "Early Bird";
      }
    }

    logStep("Determined subscription tier", { amount: session.amount_total, subscriptionTier });

    // Update the attendee table
    const { data, error } = await supabaseClient
      .from('attendee')
      .upsert({
        email: customerEmail,
        name: session.customer_details?.name || 'Conference Attendee',
        affiliation: null,
        stripesessionid: sessionId,
        stripepaymentintentid: session.payment_intent,
        status: 'PAID',
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }, { 
        onConflict: 'email',
        ignoreDuplicates: false 
      });

    if (error) {
      logStep("Error updating attendee table", { error: error.message });
      throw error;
    }

    logStep("Successfully updated attendee table", { email: customerEmail, tier: subscriptionTier });

    // Also update the subscribers table
    const { error: subscriberError } = await supabaseClient
      .from('subscribers')
      .upsert({
        email: customerEmail,
        user_id: null, // Will be updated when user logs in
        stripe_customer_id: session.customer,
        subscribed: true,
        subscription_tier: subscriptionTier,
        subscription_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });

    if (subscriberError) {
      logStep("Error updating subscribers table", { error: subscriberError.message });
    } else {
      logStep("Successfully updated subscribers table");
    }

    return new Response(JSON.stringify({ 
      success: true,
      tier: subscriptionTier,
      email: customerEmail
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in verify-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});