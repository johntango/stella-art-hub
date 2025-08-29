import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react";

const Dates = () => {
  const importantDates = [
    {
      category: "Call for Papers",
      dates: [
        { event: "Paper Submission Opens", date: "October 1, 2025", status: "completed" },
        { event: "Abstract Submission Deadline", date: "December 15, 2025", status: "completed" },
        { event: "Full Paper Submission Deadline", date: "January 15, 2026", status: "upcoming" },
        { event: "Notification of Acceptance", date: "March 1, 2026", status: "future" },
        { event: "Camera-Ready Papers Due", date: "April 15, 2026", status: "future" }
      ]
    },
    {
      category: "Registration",
      dates: [
        { event: "Early Bird Registration Opens", date: "November 1, 2025", status: "completed" },
        { event: "Early Bird Deadline", date: "March 1, 2026", status: "upcoming" },
        { event: "Regular Registration Deadline", date: "May 1, 2026", status: "future" },
        { event: "Student Registration Deadline", date: "May 15, 2026", status: "future" },
        { event: "On-site Registration", date: "June 24, 2026", status: "future" }
      ]
    },
    {
      category: "Conference Events",
      dates: [
        { event: "Pre-Conference Workshops", date: "June 23, 2026", status: "future" },
        { event: "Main Conference Day 1", date: "June 24, 2026", status: "future" },
        { event: "Main Conference Day 2", date: "June 25, 2026", status: "future" },
        { event: "Post-Conference Tours", date: "June 26, 2026", status: "future" }
      ]
    }
  ];

  const timeline = [
    { month: "Oct 2025", event: "Call for papers opens" },
    { month: "Nov 2025", event: "Registration opens" },
    { month: "Dec 2025", event: "Abstract deadline" },
    { month: "Jan 2026", event: "Full paper deadline" },
    { month: "Mar 2026", event: "Notification & Early bird ends" },
    { month: "Apr 2026", event: "Camera-ready papers" },
    { month: "May 2026", event: "Regular registration ends" },
    { month: "Jun 2026", event: "Conference!" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'upcoming':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>;
      case 'upcoming':
        return <Badge className="bg-orange-100 text-orange-800 text-xs">Upcoming</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Future</Badge>;
    }
  };

  return (
    <Layout currentPage="dates">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-hero bg-clip-text text-transparent">
            Important Dates
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay up to date with all conference deadlines and milestones. 
            Mark your calendar to ensure you don't miss any important dates.
          </p>
        </div>

        {/* Conference Countdown */}
        <section className="mb-16">
          <Card className="shadow-card text-center gradient-hero text-white">
            <CardContent className="p-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-3xl font-bold mb-2">Conference Dates</h2>
              <p className="text-xl mb-4 opacity-90">June 24–25, 2026</p>
              <p className="text-lg opacity-80">Moscone Center West, San Francisco, CA</p>
            </CardContent>
          </Card>
        </section>

        {/* Timeline Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Conference Timeline</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 transform md:-translate-x-0.5"></div>
            
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-center">
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1.5 md:-translate-x-1.5 z-10"></div>
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:ml-auto'}`}>
                    <Card className="shadow-card">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{item.month}</Badge>
                          <span className="font-medium">{item.event}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Dates */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Detailed Schedule</h2>
          <div className="space-y-8">
            {importantDates.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.dates.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(item.status)}
                          <div>
                            <p className="font-medium">{item.event}</p>
                            <p className="text-sm text-muted-foreground">{item.date}</p>
                          </div>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Time Zone Information */}
        <section className="mt-16">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Time Zone Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                All deadlines are in Pacific Standard Time (PST/PDT). The conference will be held in Pacific Time.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="font-semibold">San Francisco, CA</p>
                  <p className="text-muted-foreground">PST/PDT (Conference Time)</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="font-semibold">New York, NY</p>
                  <p className="text-muted-foreground">EST/EDT (+3 hours)</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="font-semibold">London, UK</p>
                  <p className="text-muted-foreground">GMT/BST (+8 hours)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default Dates;