import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Users, Star, LogIn } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { AuthModal } from "@/components/AuthModal";

const Payment = () => {
  const [registrationType, setRegistrationType] = useState<'interest' | 'paid'>('interest');
  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  const pricingPlans = [
    {
      name: "Early Bird",
      price: "$599",
      originalPrice: "$699",
      deadline: "March 1, 2026",
      badge: "Limited Time",
      features: [
        "Full conference access",
        "Welcome reception",
        "Coffee breaks & lunch",
        "Conference materials",
        "Certificate of attendance"
      ]
    },
    {
      name: "Regular",
      price: "$499",
      deadline: "May 1, 2026",
      badge: "Standard",
      features: [
        "Full conference access",
        "Welcome reception", 
        "Coffee breaks & lunch",
        "Conference materials",
        "Certificate of attendance"
      ]
    },
    {
      name: "Student",
      price: "$200",
      deadline: "May 15, 2026",
      badge: "Student ID Required",
      features: [
        "Full conference access",
        "Coffee breaks & lunch",
        "Conference materials",
        "Student networking session",
        "Certificate of attendance"
      ]
    }
  ];

  const handleInterestRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const affiliation = formData.get('affiliation') as string;
    
    try {
      const { error } = await supabase
        .from('interest')
        .insert([{
          email,
          name: name || 'Not provided',
          affiliation: affiliation || null,
          notes: null
        }]);

      if (error) {
        throw error;
      }

      toast({
        title: "Registration successful!",
        description: "Thank you for your interest! We'll send you updates about the conference.",
      });
      
      // Reset form
      (e.target as HTMLFormElement).reset();
      
    } catch (error) {
      console.error('Error registering interest:', error);
      toast({
        title: "Registration failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaidRegistration = async (plan: string) => {
    if (!user) {
      setAuthMode('signin');
      setAuthModalOpen(true);
      toast({
        title: "Authentication required",
        description: "Please sign in to register for the conference.",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType: plan }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        
        toast({
          title: "Redirecting to payment",
          description: `Opening Stripe checkout for ${plan} registration in a new tab.`,
        });
      }
      
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Checkout failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout currentPage="payment">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-hero bg-clip-text text-transparent">
                Registration
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user.email}
                  </span>
                  <Button variant="outline" onClick={signOut} size="sm">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthModalOpen(true);
                  }}
                  size="sm"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Secure your spot at the premier AI & UX Design conference. 
            Choose from our flexible registration options.
          </p>
        </div>

        {/* Registration Type Toggle */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={registrationType === 'interest' ? "default" : "ghost"}
              onClick={() => setRegistrationType('interest')}
              className="rounded-md"
            >
              Interest Registration (Free)
            </Button>
            <Button
              variant={registrationType === 'paid' ? "default" : "ghost"}
              onClick={() => setRegistrationType('paid')}
              className="rounded-md"
            >
              Full Registration
            </Button>
          </div>
        </div>

        {registrationType === 'interest' ? (
          /* Interest Registration Form */
          <div className="max-w-md mx-auto">
            <Card className="shadow-card">
              <CardHeader className="text-center">
                <div className="mx-auto p-3 rounded-full gradient-accent text-white w-fit mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>Stay Updated</CardTitle>
                <p className="text-muted-foreground">
                  Register your interest to receive conference updates and early bird notifications.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInterestRegistration} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" required placeholder="your@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="name">Full Name (Optional)</Label>
                    <Input id="name" name="name" type="text" placeholder="Your full name" />
                  </div>
                  <div>
                    <Label htmlFor="affiliation">Affiliation (Optional)</Label>
                    <Input id="affiliation" name="affiliation" type="text" placeholder="Your organization" />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Registering..." : "Register Interest"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Paid Registration Options */
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {pricingPlans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`shadow-card hover:shadow-glow transition-smooth ${
                    index === 0 ? 'border-primary shadow-hero' : ''
                  }`}
                >
                  <CardHeader className="text-center">
                    <Badge 
                      className={`w-fit mx-auto mb-4 ${
                        index === 0 ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      {plan.badge}
                    </Badge>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-3xl font-bold text-primary">{plan.price}</span>
                      {plan.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          {plan.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Deadline: {plan.deadline}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full"
                      variant={index === 0 ? "default" : "outline"}
                      onClick={() => handlePaidRegistration(plan.name)}
                      disabled={loading}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      {loading ? "Processing..." : "Register Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5 text-primary" />
                  Registration Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">What's Included</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Access to all sessions and workshops</li>
                      <li>• Conference materials and swag bag</li>
                      <li>• Networking opportunities</li>
                      <li>• Digital access to presentations</li>
                      <li>• Certificate of attendance</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Cancellation Policy</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Full refund until April 1, 2026</li>
                      <li>• 50% refund until May 1, 2026</li>
                      <li>• No refunds after May 1, 2026</li>
                      <li>• Transfers allowed until June 1, 2026</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <AuthModal
          open={authModalOpen}
          onOpenChange={setAuthModalOpen}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      </div>
    </Layout>
  );
};

export default Payment;