import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Globe } from "lucide-react";

const Committee = () => {
  const organizers = [
    { name: "Nam Suh" },
    { name: "John Williams" },
    { name: "Kate Thompson" },
    { name: "Chris Brown" },
    { name: "Michael Foley" },
    { name: "Clarice de Souza" },
    { name: "Pam Mantri" },
    { name: "Erik Puik" },
    { name: "Erwin Rauch" },
    { name: "John Thomas" },
    { name: "Gabriele Arcidiacono" }
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
          <Card className="shadow-card">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {organizers.map((organizer, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="font-medium">{organizer.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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