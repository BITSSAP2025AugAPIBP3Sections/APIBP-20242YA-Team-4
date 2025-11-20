import { Calendar, MapPin, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date?: string;
  eventDate?: string; // Backend sends eventDate
  location: string;
  category: string;
  price?: number;
  capacity?: number;
  availableTickets?: number;
  imageUrl?: string;
}

const EventCard = ({
  id,
  title,
  description,
  date,
  eventDate,
  location,
  category,
  price,
  capacity,
  availableTickets,
  imageUrl,
}: EventCardProps) => {
  const navigate = useNavigate();

  // Use eventDate from backend, fallback to date
  const displayDate = eventDate || date;

  const getCategoryColor = (cat: string) => {
    if (!cat) return "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20";
    
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
    <Card className="overflow-hidden hover:shadow-lg transition-smooth cursor-pointer group">
      <div className="relative h-48 overflow-hidden bg-gradient-card">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
        ) : (
          <div className="w-full h-full gradient-hero flex items-center justify-center">
            <Calendar className="h-16 w-16 text-white/50" />
          </div>
        )}
        <Badge className={`absolute top-3 right-3 ${getCategoryColor(category)}`}>
          {category}
        </Badge>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold mb-4 line-clamp-1 group-hover:text-primary transition-smooth">
          {title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>
              {displayDate ? new Date(displayDate).toLocaleDateString("en-US", { 
                weekday: "short", 
                year: "numeric", 
                month: "short", 
                day: "numeric" 
              }) : 'Date TBA'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">{location}</span>
          </div>
          {(capacity || availableTickets) && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>
                {availableTickets ? `${availableTickets} tickets available` : `Capacity: ${capacity} people`}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary">
              ${price || 0}
            </p>
            <p className="text-xs text-muted-foreground">per ticket</p>
          </div>
          <Button 
            onClick={() => navigate(`/events/${id}`)}
            className="bg-primary hover:bg-primary-hover"
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
