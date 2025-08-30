import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) {
          console.error('Error checking subscription:', error);
          toast({
            title: "Error",
            description: "Could not verify subscription status.",
            variant: "destructive",
          });
        } else {
          setSubscriptionInfo(data);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [toast]);

  return (
    <Layout currentPage="payment">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <div className="mx-auto p-4 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 w-fit mb-6">
                <CheckCircle className="h-8 w-8" />
              </div>
              <CardTitle className="text-3xl mb-4">Payment Successful!</CardTitle>
              <p className="text-muted-foreground text-lg">
                Thank you for registering for the AI & UX Design Conference 2026!
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <p className="text-muted-foreground">Verifying your subscription...</p>
              ) : subscriptionInfo?.subscribed ? (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <h3 className="font-semibold text-primary">
                      Registration Confirmed - {subscriptionInfo.subscription_tier}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your subscription is active until {new Date(subscriptionInfo.subscription_end).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Conference Dates</p>
                        <p className="text-sm text-muted-foreground">June 15-17, 2026</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Confirmation Email</p>
                        <p className="text-sm text-muted-foreground">Sent to your email</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Your payment was processed, but we're still verifying your registration. 
                  You'll receive a confirmation email shortly.
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button onClick={() => navigate('/')} className="flex-1">
                  Return to Home
                </Button>
                <Button variant="outline" onClick={() => navigate('/program')} className="flex-1">
                  View Program
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;