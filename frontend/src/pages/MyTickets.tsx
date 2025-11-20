import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, QrCode, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ticketAPI, eventAPI } from "@/lib/api-service";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MyTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyTickets = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const userTickets = await ticketAPI.getUserTickets(parseInt(user.id));

      const ticketsWithEventData = await Promise.all(
        userTickets.map(async (ticket: any) => {
          try {
            const event = await eventAPI.getEventById(ticket.eventId.toString());
            return {
              ...ticket,
              eventTitle: event.title,
              eventDate: event.eventDate,
              location: event.location,
            };
          } catch (error) {
            return {
              ...ticket,
              eventTitle: 'Event Details Unavailable',
              eventDate: null,
              location: 'Unknown',
            };
          }
        })
      );

      // Filter out cancelled tickets
      const activeTickets = ticketsWithEventData.filter(ticket => ticket.status !== 'CANCELLED');
      setTickets(activeTickets);
    } catch (error) {
      toast.error("Failed to load tickets");
      setTickets([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCancelTicket = async (ticketId: number, eventTitle: string) => {
    try {
      await ticketAPI.cancelTicket(ticketId);
      toast.success(`Ticket for "${eventTitle}" cancelled successfully!`);
      fetchMyTickets();
    } catch (error) {
      toast.error("Failed to cancel ticket. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Tickets</h1>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Loading your tickets...</p>
        </div>
      ) : tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="p-6 hover:shadow-lg transition-smooth">
              <div className="flex justify-between items-start mb-4">
                <Badge className="bg-success/10 text-success border-success/20">
                  {ticket.status}
                </Badge>
                <QrCode className="h-12 w-12 text-muted-foreground" />
              </div>

              <h3 className="text-xl font-bold mb-4">{ticket.eventTitle}</h3>

              <div className="space-y-2 mb-4">
                {ticket.eventDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>
                      {new Date(ticket.eventDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{ticket.location}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Ticket ID</p>
                    <p className="font-medium">#{ticket.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-xl font-bold text-primary">
                      ${typeof ticket.price === 'number' ? ticket.price.toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="w-full mt-4"
                      size="sm"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Cancel Ticket
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Ticket?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel your ticket for "{ticket.eventTitle}"? 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Ticket</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleCancelTicket(ticket.id, ticket.eventTitle)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Yes, Cancel Ticket
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No tickets yet</h3>
          <p className="text-muted-foreground">
            Book your first event to see your tickets here
          </p>
        </Card>
      )}
    </div>
  );
};

export default MyTickets;
