import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

const Index = () => {
  const highlights = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "100 Attendees",
      description: "Connect with researchers, designers, and industry leaders"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "2 Days",
      description: "Intensive program with keynotes, workshops, and networking"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "World-Class Venue", 
      description: "State-of-the-art facilities in the heart of innovation"
    }
  ];

  const speakers = [
    { name: "Dr. Nam P. Suh", affiliation: "MIT", topic: "The Future of AI and Human Creativity" },
    { name: "Dr. A. Henry", affiliation: "Apple (Former)", topic: "Design in the Age of AI" },
    { name: "Dr. Fei Zu", affiliation: "Stanford HAI", topic: "Human-Centered AI" }
  ];

  return (
    <Layout currentPage="home">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-start justify-center overflow-hidden pt-8">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(/lovable-uploads/5a7e57c6-6550-4ab1-a7ae-f6459e6d4a79.png)` }}
        >
          <div className="absolute inset-0 gradient-dark opacity-60"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">
            NY and Boston 2026
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 mt-32 leading-tight">
            Stella Art Hub 
            <span className="block gradient-accent bg-clip-text text-transparent">@BOSTON</span>
          </h1>
          <p className="text-xl md:text-2xl mb-6 -mt-2 max-w-3xl mx-auto opacity-90">
            Redefining roles: How humans and AI can co-create the Future of Art
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="shadow-hero bg-white text-conference-dark hover:bg-white/90" asChild>
              <a href="/payment">
                Register Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <a href="/call-for-papers">Submit Papers</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Conference Highlights */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Conference Highlights</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Two days of cutting-edge research, inspiring talks, and networking opportunities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item, index) => (
              <Card key={index} className="text-center shadow-card hover:shadow-glow transition-smooth">
                <CardHeader>
                  <div className="mx-auto p-4 rounded-full gradient-accent text-white w-fit mb-4">
                    {item.icon}
                  </div>
                  <CardTitle className="text-2xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Speakers */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Keynote Speakers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn from the pioneers who are defining the role of AI in art
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {speakers.map((speaker, index) => (
              <Card key={index} className="shadow-card hover:shadow-glow transition-smooth">
                <CardHeader>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-hero"></div>
                  <CardTitle className="text-center">{speaker.name}</CardTitle>
                  <p className="text-center text-primary text-sm">{speaker.affiliation}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground text-sm">{speaker.topic}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Us?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Don't miss this opportunity to be part of the conversation shaping the future of AI and art.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-hero" asChild>
              <a href="/payment">Get Updates</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <a href="/call-for-papers">View Call for Papers</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
