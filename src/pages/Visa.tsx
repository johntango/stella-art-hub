import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, FileText, Globe, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const Visa = () => {
  const visaRequirements = [
    {
      category: "Visa Waiver Program (VWP)",
      countries: ["UK", "Germany", "France", "Japan", "Australia", "South Korea", "and 33 others"],
      requirements: [
        "Valid passport",
        "ESTA authorization (apply online)",
        "Stay up to 90 days",
        "No extensions allowed"
      ],
      processingTime: "Usually approved instantly",
      icon: <CheckCircle className="h-6 w-6 text-green-600" />
    },
    {
      category: "B-1 Business Visa",
      countries: ["China", "India", "Russia", "Brazil", "and others"],
      requirements: [
        "Valid passport (6+ months)",
        "DS-160 form completed",
        "Visa application fee",
        "Interview at US Embassy",
        "Conference invitation letter"
      ],
      processingTime: "2-8 weeks",
      icon: <Clock className="h-6 w-6 text-orange-500" />
    }
  ];

  const documents = [
    {
      title: "Conference Invitation Letter",
      description: "Official letter from conference organizers",
      required: "For visa applications",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Registration Confirmation",
      description: "Proof of conference registration and payment",
      required: "For all attendees",
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      title: "Hotel Reservation",
      description: "Confirmed accommodation in San Francisco",
      required: "For visa applications",
      icon: <Globe className="h-5 w-5" />
    },
    {
      title: "Travel Insurance",
      description: "Valid travel and health insurance",
      required: "Recommended for all",
      icon: <AlertTriangle className="h-5 w-5" />
    }
  ];

  const steps = [
    {
      step: 1,
      title: "Check Visa Requirements",
      description: "Determine if you need a visa based on your nationality"
    },
    {
      step: 2,
      title: "Register for Conference",
      description: "Complete your conference registration and payment"
    },
    {
      step: 3,
      title: "Request Invitation Letter",
      description: "Contact us for your official invitation letter"
    },
    {
      step: 4,
      title: "Apply for Visa/ESTA",
      description: "Submit your application with all required documents"
    },
    {
      step: 5,
      title: "Plan Your Travel",
      description: "Book flights and accommodation once approved"
    }
  ];

  return (
    <Layout currentPage="visa">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-hero bg-clip-text text-transparent">
            Visa Information
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            International attendees: Get all the information you need for 
            travel documentation and visa requirements for the United States.
          </p>
        </div>

        {/* Important Notice */}
        <section className="mb-16">
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                    Important: Start Early
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Visa processing can take several weeks or months. We strongly recommend starting 
                    your visa application process as soon as possible after registering for the conference.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Visa Requirements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Visa Requirements by Country</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {visaRequirements.map((visa, index) => (
              <Card key={index} className="shadow-card">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    {visa.icon}
                    <CardTitle>{visa.category}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {visa.countries.map((country, countryIndex) => (
                      <Badge key={countryIndex} variant="outline" className="text-xs">
                        {country}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Requirements:</h4>
                      <ul className="space-y-1">
                        {visa.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="text-sm flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-sm">
                        <strong>Processing Time:</strong> {visa.processingTime}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Required Documents */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Required Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc, index) => (
              <Card key={index} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-lg gradient-accent text-white">
                      {doc.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {doc.required}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Step-by-Step Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Application Process</h2>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <Card key={index} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full gradient-hero text-white flex items-center justify-center font-bold text-lg">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact and Support */}
        <section>
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <div className="mx-auto p-3 rounded-full gradient-accent text-white w-fit mb-4">
                <Plane className="h-6 w-6" />
              </div>
              <CardTitle>Need Help with Your Visa?</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Our conference team is here to assist you with visa documentation and travel planning.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Request Invitation Letter
                </Button>
                <Button variant="outline" className="w-full">
                  <Globe className="mr-2 h-4 w-4" />
                  Contact Visa Support
                </Button>
              </div>
              <div className="mt-6 p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  <strong>Visa Support Email:</strong> visa@icadai.design<br />
                  <strong>Response Time:</strong> 2-3 business days
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default Visa;