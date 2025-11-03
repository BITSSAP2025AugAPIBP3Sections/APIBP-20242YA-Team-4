import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, QrCode } from "lucide-react";

const MyTickets = () => {
  // Mock ticket data
  const tickets = [
    {
      id: "TKT-001",
      eventTitle: "Summer Music Festival 2025",
      date: "2025-07-15",
      location: "Central Park, New York",
      quantity: 2,
      totalPrice: 99.98,
      status: "confirmed",
    },
    {
      id: "TKT-002",
      eventTitle: "Tech Innovation Summit",
      date: "2025-08-20",
      location: "Convention Center, San Francisco",
      quantity: 1,
      totalPrice: 99.99,
      status: "confirmed",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Tickets</h1>

      {tickets.length > 0 ? (
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
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>
                    {new Date(ticket.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{ticket.location}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Booking ID</p>
                    <p className="font-medium">{ticket.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold text-primary">
                      ${ticket.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Quantity: {ticket.quantity} ticket{ticket.quantity > 1 ? "s" : ""}
                </p>
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
