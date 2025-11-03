import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowLeft, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock event data - in real app, fetch from API
  const event = {
    id: id,
    title: "Summer Music Festival 2025",
    description: "Join us for an unforgettable night of live music with top artists from around the world. Experience multiple stages, food vendors, and an amazing atmosphere that will create memories to last a lifetime.",
    fullDescription: `
      Get ready for the most spectacular music festival of the summer! Our lineup features:
      
      • 20+ world-class artists across 3 stages
      • Gourmet food trucks and beverage stations
      • VIP lounge areas with premium amenities
      • Interactive art installations
      • Safe and secure environment with professional staff
      
      Don't miss this incredible opportunity to be part of something special. Tickets are selling fast!
    `,
    date: "2025-07-15",
    location: "Central Park, New York",
    category: "festival",
    price: 49.99,
    availableTickets: 500,
    totalTickets: 1000,
    organizer: "Event Masters Inc.",
  };

  const handleBookTicket = () => {
    if (!user) {
      toast.error("Please login to book tickets");
      navigate("/login");
      return;
    }
    toast.success("Redirecting to payment...");
    navigate(`/payment?eventId=${event.id}&eventName=${encodeURIComponent(event.title)}&price=${event.price}`);
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      college: "bg-primary/10 text-primary border-primary/20",
      concert: "bg-accent/10 text-accent border-accent/20",
      festival: "bg-success/10 text-success border-success/20",
      workshop: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20",
      sports: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return colors[cat.toLowerCase()] || colors.workshop;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate("/events")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="relative h-96 rounded-xl overflow-hidden mb-6 gradient-hero shadow-lg">
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="h-32 w-32 text-white/50" />
            </div>
            <Badge className={`absolute top-4 right-4 ${getCategoryColor(event.category)}`}>
              {event.category}
            </Badge>
          </div>

          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-medium">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {event.availableTickets} / {event.totalTickets} tickets available
              </span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">About This Event</h2>
            <p className="text-muted-foreground mb-4">{event.description}</p>
            <pre className="whitespace-pre-wrap text-muted-foreground font-sans">
              {event.fullDescription}
            </pre>
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20 shadow-lg">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-1">Starting from</p>
              <p className="text-4xl font-bold text-primary">${event.price}</p>
              <p className="text-sm text-muted-foreground">per ticket</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-1">Availability</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-background rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-success h-full transition-all"
                      style={{
                        width: `${(event.availableTickets / event.totalTickets) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round((event.availableTickets / event.totalTickets) * 100)}%
                  </span>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-1">Organized by</p>
                <p className="text-sm text-muted-foreground">{event.organizer}</p>
              </div>
            </div>

            <Button
              onClick={handleBookTicket}
              className="w-full bg-primary hover:bg-primary-hover h-12 text-base font-semibold"
              disabled={event.availableTickets === 0}
            >
              <Ticket className="mr-2 h-5 w-5" />
              {event.availableTickets > 0 ? "Book Tickets Now" : "Sold Out"}
            </Button>

            {event.availableTickets > 0 && event.availableTickets < 50 && (
              <p className="text-sm text-destructive mt-3 text-center font-medium">
                Only {event.availableTickets} tickets left!
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
