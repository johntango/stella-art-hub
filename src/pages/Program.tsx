import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User } from "lucide-react";

const Program = () => {
  const day1Schedule = [
    {
      time: "8:00 - 9:00",
      title: "Registration & Coffee",
      type: "logistics",
      location: "Main Lobby"
    },
    {
      time: "9:00 - 9:15",
      title: "Welcome & Opening Remarks",
      speaker: "Conference Chairs",
      type: "opening",
      location: "Main Auditorium"
    },
    {
      time: "9:15 - 10:00",
      title: "The Future of AI and Human Creativity",
      speaker: "Dr. Nam P. Suh",
      affiliation: "Meta AI",
      type: "keynote",
      location: "Main Auditorium"
    },
    {
      time: "10:00 - 10:30",
      title: "Coffee Break & Networking",
      type: "break",
      location: "Exhibition Hall"
    },
    {
      time: "10:30 - 12:00",
      title: "AI-Powered Design Tools",
      type: "session",
      location: "Room A",
      papers: [
        "Automated Layout Generation using Deep Learning",
        "AI-Assisted Color Palette Creation",
        "Generative Typography Systems"
      ]
    },
    {
      time: "12:00 - 13:30",
      title: "Lunch & Poster Session",
      type: "break",
      location: "Exhibition Hall"
    },
    {
      time: "13:30 - 14:15",
      title: "Design in the Age of AI",
      speaker: "Susan Kare",
      affiliation: "Apple (Former)",
      type: "keynote",
      location: "Main Auditorium"
    },
    {
      time: "14:15 - 15:45",
      title: "Human-AI Collaboration",
      type: "session",
      location: "Room B",
      papers: [
        "Co-creative Design Processes",
        "Trust in AI Design Assistants",
        "Designing for Human-AI Teams"
      ]
    }
  ];

  const workshops = [
    {
      title: "Hands-on AI Design Tools",
      instructor: "Dr. Sarah Chen",
      duration: "3 hours",
      description: "Learn to use cutting-edge AI tools for design automation and enhancement."
    },
    {
      title: "Ethics in AI-Driven UX",
      instructor: "Prof. Maya Singh",
      duration: "2 hours", 
      description: "Explore ethical considerations when implementing AI in user experience design."
    },
    {
      title: "Building Adaptive Interfaces",
      instructor: "Marcus Rodriguez",
      duration: "3 hours",
      description: "Create interfaces that adapt to user behavior using machine learning."
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'keynote': return 'bg-primary text-primary-foreground';
      case 'session': return 'bg-secondary text-secondary-foreground';
      case 'workshop': return 'bg-accent text-accent-foreground';
      case 'break': return 'bg-muted text-muted-foreground';
      case 'opening': return 'bg-conference-gold text-conference-dark';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Layout currentPage="program">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-hero bg-clip-text text-transparent">
            Conference Program
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Two days packed with keynotes, research presentations, workshops, 
            and networking opportunities at the forefront of AI and design.
          </p>
        </div>

        {/* Program Overview */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Badge className="mr-3 bg-primary">Day 1</Badge>
                  June 24, 2026
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Keynote presentations</li>
                  <li>• Research paper sessions</li>
                  <li>• Poster presentations</li>
                  <li>• Welcome reception</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Badge className="mr-3 bg-secondary">Day 2</Badge>
                  June 25, 2026
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Industry presentations</li>
                  <li>• Hands-on workshops</li>
                  <li>• Panel discussions</li>
                  <li>• Closing ceremony</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Day 1 Schedule */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Day 1 - June 24, 2026</h2>
          <div className="space-y-4">
            {day1Schedule.map((item, index) => (
              <Card key={index} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge className={getTypeColor(item.type)}>
                          {item.time}
                        </Badge>
                        <Badge variant="outline">
                          <MapPin className="h-3 w-3 mr-1" />
                          {item.location}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      {item.speaker && (
                        <p className="text-primary font-medium">
                          <User className="h-4 w-4 inline mr-1" />
                          {item.speaker}
                          {item.affiliation && <span className="text-muted-foreground"> - {item.affiliation}</span>}
                        </p>
                      )}
                      {item.papers && (
                        <ul className="mt-2 space-y-1">
                          {item.papers.map((paper, paperIndex) => (
                            <li key={paperIndex} className="text-sm text-muted-foreground">
                              • {paper}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Workshops */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Pre-Conference Workshops</h2>
          <p className="text-muted-foreground mb-8 text-center">
            June 23, 2026 - Optional workshops available for additional registration
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workshops.map((workshop, index) => (
              <Card key={index} className="shadow-card hover:shadow-glow transition-smooth">
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-accent text-accent-foreground">Workshop</Badge>
                  <CardTitle className="text-lg">{workshop.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {workshop.instructor}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {workshop.duration}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{workshop.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Program;