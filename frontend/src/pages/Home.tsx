import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Search, Ticket } from "lucide-react";
import EventCard from "@/components/EventCard";
import { eventAPI } from "@/lib/api-service";

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch top 3 recent events from backend
  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        const events = await eventAPI.getAllEvents();
        // Get the 3 most recent events (assuming they're ordered by ID or date)
        const recentEvents = events.slice(-3).reverse(); // Get last 3 and reverse to show newest first
        setFeaturedEvents(recentEvents);
      } catch (error) {
        console.error('❌ Failed to fetch featured events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Discover Amazing Events Near You
            </h1>
            <p className="text-xl mb-8 text-white/90 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
              From concerts to festivals, workshops to sports - find and book tickets for the best events in your city.
            </p>
            <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <Link to="/events">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Events
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Diverse Events</h3>
            <p className="text-muted-foreground">
              From college fests to international concerts, find events for every interest.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
            <p className="text-muted-foreground">
              Secure your spot in seconds with our simple and fast booking process.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Discovery</h3>
            <p className="text-muted-foreground">
              Find events tailored to your interests with powerful search and filters.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Events</h2>
          <p className="text-muted-foreground text-lg">
            Check out the latest events happening now
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Loading featured events...</p>
          </div>
        ) : featuredEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/events">
                <Button size="lg" className="bg-primary hover:bg-primary-hover">
                  View All Events
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to create an event!
            </p>
            <Link to="/events">
              <Button size="lg" className="bg-primary hover:bg-primary-hover">
                Browse Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
