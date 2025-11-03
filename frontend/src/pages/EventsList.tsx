import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import EventCard from "@/components/EventCard";

const EventsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { name: "All", value: null, color: "bg-primary/10 text-primary hover:bg-primary/20" },
    { name: "College", value: "college", color: "bg-primary/10 text-primary hover:bg-primary/20" },
    { name: "Concert", value: "concert", color: "bg-accent/10 text-accent hover:bg-accent/20" },
    { name: "Festival", value: "festival", color: "bg-success/10 text-success hover:bg-success/20" },
    { name: "Workshop", value: "workshop", color: "bg-muted-foreground/10 text-muted-foreground hover:bg-muted-foreground/20" },
    { name: "Sports", value: "sports", color: "bg-destructive/10 text-destructive hover:bg-destructive/20" },
  ];

  // Mock events data
  const allEvents = [
    {
      id: "1",
      title: "Summer Music Festival 2025",
      description: "Join us for an unforgettable night of live music with top artists from around the world.",
      date: "2025-07-15",
      location: "Central Park, New York",
      category: "festival",
      price: 49.99,
      availableTickets: 500,
    },
    {
      id: "2",
      title: "Tech Innovation Summit",
      description: "Discover the latest trends in technology and network with industry leaders.",
      date: "2025-08-20",
      location: "Convention Center, San Francisco",
      category: "workshop",
      price: 99.99,
      availableTickets: 200,
    },
    {
      id: "3",
      title: "Rock Concert: The Legends",
      description: "Experience the greatest rock bands of all time in one epic night.",
      date: "2025-09-10",
      location: "Madison Square Garden, NYC",
      category: "concert",
      price: 79.99,
      availableTickets: 1000,
    },
    {
      id: "4",
      title: "College Fest 2025",
      description: "Annual college cultural festival with performances, competitions, and fun activities.",
      date: "2025-06-05",
      location: "University Campus, Boston",
      category: "college",
      price: 15.00,
      availableTickets: 800,
    },
    {
      id: "5",
      title: "Marathon Championship",
      description: "Join thousands of runners in this year's biggest marathon event.",
      date: "2025-10-15",
      location: "City Center, Chicago",
      category: "sports",
      price: 25.00,
      availableTickets: 2000,
    },
    {
      id: "6",
      title: "Jazz Night Under Stars",
      description: "An evening of smooth jazz performances in an outdoor setting.",
      date: "2025-07-22",
      location: "Lakeside Park, Seattle",
      category: "concert",
      price: 35.00,
      availableTickets: 300,
    },
  ];

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Discover Events</h1>
        <p className="text-muted-foreground text-lg">
          Find the perfect event for your interests
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search events by name, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base shadow-sm"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.value || "all"}
              className={`cursor-pointer px-4 py-2 text-sm font-medium transition-smooth border ${
                selectedCategory === category.value
                  ? category.color + " border-current"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent"
              }`}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => <EventCard key={event.id} {...event} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-muted-foreground">
              No events found matching your criteria. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>

      {/* Results Count */}
      {filteredEvents.length > 0 && (
        <div className="mt-8 text-center text-muted-foreground">
          Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default EventsList;
