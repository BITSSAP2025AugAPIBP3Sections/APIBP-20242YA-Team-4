import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowLeft, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { eventAPI } from "@/lib/api-service";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch event details from backend
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return;
      
      try {
        console.log('🔍 Fetching event details for ID:', id);
        const eventData = await eventAPI.getEventById(id);
        console.log('✅ Fetched event:', eventData);
        console.log('💰 Price from backend:', eventData.price);
        console.log('👥 Capacity from backend:', eventData.capacity);
        console.log('📅 Event date from backend:', eventData.eventDate);
        setEvent(eventData);
      } catch (error) {
        console.error('❌ Failed to fetch event:', error);
        toast.error("Failed to load event details");
        navigate('/events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Event not found</p>
          <Button onClick={() => navigate('/events')} className="mt-4">
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  const handleBookTicket = () => {
    if (!user) {
      toast.error("Please login to book tickets");
      navigate("/login");
      return;
    }
    toast.success("Redirecting to payment...");
    navigate(`/payment?eventId=${event.id}&eventName=${encodeURIComponent(event.title)}&price=${event.price}`);
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      return;
    }

    try {
      await eventAPI.deleteEvent(event.id);
      toast.success("Event deleted successfully!");
      navigate('/events');
    } catch (error) {
      console.error("❌ Delete event error:", error);
      toast.error("Failed to delete event");
    }
  };

  const handleUpdateEvent = () => {
    navigate(`/update-event/${event.id}`);
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
            <Badge className={`absolute top-4 right-4 ${getCategoryColor(event.category || 'workshop')}`}>
              {event.category || 'Event'}
            </Badge>
          </div>

          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {new Date(event.eventDate || event.date).toLocaleDateString("en-US", {
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
            {event.capacity && (
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  Capacity: {event.capacity} people
                </span>
              </div>
            )}
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">About This Event</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20 shadow-lg">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-1">Starting from</p>
              <p className="text-4xl font-bold text-primary">
                ${typeof event.price === 'number' ? event.price.toFixed(2) : (event.price || 0)}
              </p>
              <p className="text-sm text-muted-foreground">per ticket</p>
            </div>

            {event.capacity && (
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Event Capacity</p>
                  <p className="text-lg font-semibold">{event.capacity} people</p>
                </div>
              </div>
            )}

            {/* Book Tickets - Only for Attendees */}
            {user && user.role !== 'ORGANIZER' && (
              <Button
                onClick={handleBookTicket}
                className="w-full bg-primary hover:bg-primary-hover h-12 text-base font-semibold mb-4"
              >
                <Ticket className="mr-2 h-5 w-5" />
                Book Tickets Now
              </Button>
            )}

            {/* Organizer Actions */}
            {user && user.role === 'ORGANIZER' && (
              <div className="space-y-3 pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground mb-2">Organizer Actions</p>
                <Button
                  onClick={handleUpdateEvent}
                  className="w-full bg-primary hover:bg-primary-hover"
                >
                  Update Event
                </Button>
                <Button
                  onClick={handleDeleteEvent}
                  variant="destructive"
                  className="w-full"
                >
                  Delete Event
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
