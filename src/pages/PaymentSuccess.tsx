import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, MapPin, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [registrationDetails, setRegistrationDetails] = useState<{
    tier: string;
    email: string;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setLoading(false);
        toast({
          title: "Session not found",
          description: "Payment session ID is missing. Please contact support if you completed a payment.",
          variant: "destructive",
        });
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId }
        });

        if (error) {
          throw error;
        }

        if (data?.success) {
          setPaymentVerified(true);
          setRegistrationDetails({
            tier: data.tier,
            email: data.email
          });
          toast({
            title: "Registration confirmed!",
            description: "Your payment has been processed and registration is complete.",
          });
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast({
          title: "Verification failed",
          description: "Could not verify your payment. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, toast]);

  if (loading) {
    return (
      <Layout currentPage="payment">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold mb-4">Verifying Payment...</h1>
            <p className="text-muted-foreground">Please wait while we confirm your registration.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="payment">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {paymentVerified ? (
            <>
              {/* Success Message */}
              <div className="text-center mb-8">
                <div className="mx-auto p-4 rounded-full gradient-accent text-white w-fit mb-6">
                  <CheckCircle className="h-12 w-12" />
                </div>
                <h1 className="text-4xl font-bold mb-4 gradient-hero bg-clip-text text-transparent">
                  Registration Complete!
                </h1>
                <p className="text-xl text-muted-foreground">
                  Thank you for registering for the AI & UX Design Conference 2026
                </p>
              </div>

              {/* Registration Details */}
              <Card className="shadow-card mb-8">
                <CardHeader>
                  <CardTitle>Registration Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Registration Type:</span>
                    <span className="font-semibold">{registrationDetails?.tier}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-semibold">{registrationDetails?.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-green-600 font-semibold">Confirmed</span>
                  </div>
                </CardContent>
              </Card>

              {/* Conference Information */}
              <Card className="shadow-card mb-8">
                <CardHeader>
                  <CardTitle>Conference Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>June 15-17, 2026</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>9:00 AM - 6:00 PM each day</span>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>What's Next?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>You will receive a confirmation email shortly</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Conference materials will be sent 2 weeks before the event</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Hotel and travel information will be provided</span>
                    </li>
                  </ul>
                  <div className="mt-6 text-center">
                    <Button 
                      onClick={() => window.location.href = '/'}
                      className="mr-4"
                    >
                      Return to Home
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/program'}
                    >
                      View Program
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Error State */
            <div className="text-center">
              <div className="mx-auto p-4 rounded-full bg-destructive/10 text-destructive w-fit mb-6">
                <AlertCircle className="h-12 w-12" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Payment Verification Failed</h1>
              <p className="text-xl text-muted-foreground mb-8">
                We couldn't verify your payment. If you completed a payment, please contact support.
              </p>
              <div className="space-x-4">
                <Button onClick={() => window.location.href = '/payment'}>
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                  Return to Home
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;