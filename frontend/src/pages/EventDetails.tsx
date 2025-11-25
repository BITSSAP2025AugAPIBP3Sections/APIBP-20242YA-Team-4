import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, DollarSign, ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { eventAPI, feedbackAPI, attendeeAPI, ticketAPI } from "@/lib/api-service";
import { toast } from "sonner";
import { FeedbackForm } from "@/components/FeedbackForm";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackUsers, setFeedbackUsers] = useState<Map<number, any>>(new Map());
  const [userFeedback, setUserFeedback] = useState<any>(null);
  const [hasTicket, setHasTicket] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  // Fetch event details and feedback from backend
  useEffect(() => {
    const loadEventAndFeedback = async () => {
      if (!id) return;
      
      try {
        const eventData = await eventAPI.getEventById(id);
        setEvent(eventData);
        setIsLoading(false);

        // Fetch feedback for this event
        try {
          const eventFeedback = await feedbackAPI.getFeedbackByEvent(parseInt(id));
          setFeedbacks(eventFeedback);

          // Fetch user details for each feedback
          const userDetailsMap = new Map();
          await Promise.all(
            eventFeedback.map(async (fb: any) => {
              try {
                const userDetails = await attendeeAPI.getById(fb.userId.toString());
                userDetailsMap.set(fb.userId, userDetails);
              } catch (error) {
                // User not found, use fallback
                userDetailsMap.set(fb.userId, { fullName: 'Anonymous User' });
              }
            })
          );
          setFeedbackUsers(userDetailsMap);
        } catch (error) {
          // No feedback yet
          setFeedbacks([]);
        }

        // Check if current user has attended this event and can leave feedback
        if (user && user.role !== 'ORGANIZER') {
          try {
            const userTickets = await ticketAPI.getUserTickets(parseInt(user.id));
            const hasEventTicket = userTickets.some((ticket: any) => 
              ticket.eventId === parseInt(id) && ticket.status !== 'CANCELLED'
            );
            setHasTicket(hasEventTicket);

            // Check if user already submitted feedback
            if (hasEventTicket) {
              const userFeedbacks = await feedbackAPI.getFeedbackByUser(parseInt(user.id));
              const existingFeedback = userFeedbacks.find((fb: any) => fb.eventId === parseInt(id));
              setUserFeedback(existingFeedback || null);
            }
          } catch (error) {
            setHasTicket(false);
          }
        }
      } catch (error) {
        toast.error("Failed to load event details");
        setIsLoading(false);
      }
    };

    loadEventAndFeedback();
  }, [id, user]);

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

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-accent text-accent' : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  const calculateAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, fb) => acc + fb.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
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
                <DollarSign className="mr-2 h-5 w-5" />
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

      {/* Reviews & Feedback Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
          
          {/* Write Review Button - Only for attendees who have tickets and event has passed */}
          {user && user.role !== 'ORGANIZER' && hasTicket && event && new Date(event.eventDate) < new Date() && (
            <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
              <DialogTrigger asChild>
                <Button variant={userFeedback ? "outline" : "default"}>
                  <Star className="mr-2 h-4 w-4" />
                  {userFeedback ? 'Update Review' : 'Write a Review'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {userFeedback ? 'Update Your Review' : 'Write a Review'}
                  </DialogTitle>
                  <DialogDescription>
                    Share your experience at {event.title}
                  </DialogDescription>
                </DialogHeader>
                <FeedbackForm
                  eventId={id!}
                  eventTitle={event.title}
                  existingFeedback={userFeedback || null}
                  onSuccess={() => {
                    setFeedbackDialogOpen(false);
                    window.location.reload(); // Refresh to show new feedback
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        {feedbacks.length > 0 ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(parseFloat(calculateAverageRating())))}
              </div>
              <span className="text-lg font-semibold">{calculateAverageRating()}</span>
              <span className="text-muted-foreground">({feedbacks.length} {feedbacks.length === 1 ? 'review' : 'reviews'})</span>
            </div>

            <div className="space-y-4">
              {feedbacks.map((feedback) => {
                const userDetails = feedbackUsers.get(feedback.userId);
                const userName = userDetails?.fullName || 'Anonymous User';
                const userInitials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2);

                return (
                  <Card key={feedback.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {userInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{userName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {renderStars(feedback.rating)}
                              <span className="text-xs text-muted-foreground">
                                {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{feedback.comment}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <Card className="p-8 text-center">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No reviews yet. Be the first to review this event!</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
