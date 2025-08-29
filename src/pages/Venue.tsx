import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Car, Plane, Train, Wifi, Coffee, Car as ParkingIcon } from "lucide-react";

const Venue = () => {
  const amenities = [
    { icon: <Wifi className="h-5 w-5" />, text: "High-speed WiFi" },
    { icon: <Coffee className="h-5 w-5" />, text: "Coffee stations" },
    { icon: <ParkingIcon className="h-5 w-5" />, text: "Parking available" },
    { icon: <MapPin className="h-5 w-5" />, text: "Central location" }
  ];

  const transportation = [
    {
      icon: <Plane className="h-6 w-6" />,
      title: "By Air",
      description: "San Francisco International Airport (SFO) - 30 minutes by car",
      details: "Direct flights from major cities worldwide"
    },
    {
      icon: <Train className="h-6 w-6" />,
      title: "By Train",
      description: "Caltrain and BART stations within walking distance",
      details: "Easy connections from throughout the Bay Area"
    },
    {
      icon: <Car className="h-6 w-6" />,
      title: "By Car",
      description: "Valet parking and nearby parking structures available",
      details: "$20/day conference rate"
    }
  ];

  const nearbyHotels = [
    { name: "The Westin San Francisco", distance: "0.2 miles", rate: "$299/night" },
    { name: "Hotel Nikko San Francisco", distance: "0.4 miles", rate: "$249/night" },
    { name: "Hilton San Francisco Union Square", distance: "0.5 miles", rate: "$279/night" },
    { name: "The St. Regis San Francisco", distance: "0.3 miles", rate: "$399/night" }
  ];

  return (
    <Layout currentPage="venue">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-hero bg-clip-text text-transparent">
            Conference Venue
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join us at the prestigious Moscone Center in the heart of San Francisco, 
            perfectly positioned for an inspiring conference experience.
          </p>
        </div>

        {/* Venue Details */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Moscone Center West</h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-muted-foreground">800 Howard Street<br />San Francisco, CA 94103</p>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">
                The Moscone Center is San Francisco's premier convention facility, located in the heart 
                of SOMA district. This world-class venue offers state-of-the-art facilities and is 
                surrounded by the city's vibrant tech and design community.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg gradient-accent text-white">
                      {amenity.icon}
                    </div>
                    <span className="text-sm">{amenity.text}</span>
                  </div>
                ))}
              </div>

              <Button className="shadow-card">
                <MapPin className="mr-2 h-4 w-4" />
                View on Google Maps
              </Button>
            </div>
            
            <div>
              <Card className="shadow-card">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center p-8">
                      <MapPin className="h-12 w-12 mx-auto text-primary mb-4" />
                      <p className="text-muted-foreground">Interactive venue map coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Transportation */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Getting There</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {transportation.map((method, index) => (
              <Card key={index} className="shadow-card hover:shadow-glow transition-smooth">
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 rounded-full gradient-accent text-white w-fit mb-4">
                    {method.icon}
                  </div>
                  <CardTitle>{method.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="font-semibold mb-2">{method.description}</p>
                  <p className="text-sm text-muted-foreground">{method.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Nearby Hotels */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Recommended Hotels</h2>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Conference Hotel Partners</CardTitle>
              <p className="text-muted-foreground">
                We've secured special rates at these nearby hotels for conference attendees.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nearbyHotels.map((hotel, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <h3 className="font-semibold">{hotel.name}</h3>
                      <p className="text-sm text-muted-foreground">{hotel.distance} from venue</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{hotel.rate}</p>
                      <p className="text-xs text-muted-foreground">Conference rate</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm">
                  <strong>Booking Code:</strong> Use code "AIAX2026" when booking to receive the conference rate. 
                  Book by April 1, 2026 to guarantee availability.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Venue Accessibility */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Accessibility</h2>
          <Card className="shadow-card">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Accessibility Features</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Wheelchair accessible entrances and facilities</li>
                    <li>• Accessible restrooms on all floors</li>
                    <li>• Sign language interpreters available upon request</li>
                    <li>• Audio induction loops in main auditorium</li>
                    <li>• Reserved seating for accessibility needs</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Special Requests</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We are committed to making our conference accessible to all attendees. 
                    Please contact us at least 2 weeks before the event with any special requirements.
                  </p>
                  <Button variant="outline">
                    Contact Accessibility Team
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default Venue;