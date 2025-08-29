import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Globe } from "lucide-react";

const Committee = () => {
  const organizers = [
    {
      name: "Dr. Sarah Chen",
      role: "Conference Chair",
      affiliation: "MIT Media Lab",
      bio: "Leading researcher in AI-driven design systems and human-computer interaction.",
      email: "sarah.chen@mit.edu",
      linkedin: "#",
      website: "#"
    },
    {
      name: "Prof. Marcus Rodriguez",
      role: "Program Chair",
      affiliation: "Stanford HCI Group",
      bio: "Expert in adaptive user interfaces and machine learning applications in UX.",
      email: "marcus@stanford.edu",
      linkedin: "#",
      website: "#"
    },
    {
      name: "Dr. Aisha Patel",
      role: "Industry Liaison",
      affiliation: "Google AI",
      bio: "Product design leader focusing on AI ethics and inclusive design practices.",
      email: "aisha@google.com",
      linkedin: "#",
      website: "#"
    }
  ];

  const reviewers = [
    "Dr. Elena Kotsanova - Carnegie Mellon University",
    "Prof. James Liu - University of Washington",
    "Dr. Maya Singh - Adobe Research",
    "Prof. David Thompson - UC Berkeley",
    "Dr. Lisa Park - Microsoft Research",
    "Prof. Ahmed Hassan - University of Toronto"
  ];

  return (
    <Layout currentPage="committee">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-hero bg-clip-text text-transparent">
            Organizing Committee
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the distinguished researchers and industry leaders organizing the 
            AI & AX Design Conference 2026.
          </p>
        </div>

        {/* Conference Organizers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Conference Organizers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {organizers.map((organizer, index) => (
              <Card key={index} className="shadow-card hover:shadow-glow transition-smooth">
                <CardHeader>
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full gradient-accent"></div>
                  <CardTitle className="text-center">{organizer.name}</CardTitle>
                  <p className="text-center text-primary font-semibold">{organizer.role}</p>
                  <p className="text-center text-sm text-muted-foreground">{organizer.affiliation}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{organizer.bio}</p>
                  <div className="flex justify-center space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`mailto:${organizer.email}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={organizer.linkedin}>
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={organizer.website}>
                        <Globe className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Program Committee */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Program Committee</h2>
          <Card className="shadow-card">
            <CardContent className="p-8">
              <p className="text-center text-muted-foreground mb-8">
                Our program committee consists of leading experts in AI, UX design, 
                and human-computer interaction from top institutions worldwide.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviewers.map((reviewer, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-sm">{reviewer}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default Committee;