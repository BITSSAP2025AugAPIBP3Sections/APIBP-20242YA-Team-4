import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Users, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { eventAPI } from '@/lib/api-service';

export default function UpdateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location: '',
    price: '',
    capacity: '',
    imageUrl: '',
  });

  // Fetch existing event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        const eventData = await eventAPI.getEventById(id);
        
        // Parse the eventDate to split into date and time
        const eventDateTime = new Date(eventData.eventDate);
        const dateStr = eventDateTime.toISOString().split('T')[0];
        const timeStr = eventDateTime.toTimeString().slice(0, 5);

        setFormData({
          title: eventData.title || '',
          description: eventData.description || '',
          category: eventData.category || '',
          date: dateStr,
          time: timeStr,
          location: eventData.location || '',
          price: eventData.price?.toString() || '',
          capacity: eventData.capacity?.toString() || '',
          imageUrl: eventData.imageUrl || '',
        });
      } catch (error) {
        console.error('Failed to fetch event:', error);
        toast.error('Failed to load event data');
        navigate('/events');
      } finally {
        setIsFetching(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || user.role !== 'ORGANIZER') {
      toast.error("Only organizers can update events");
      return;
    }

    if (!formData.title || !formData.category || !formData.date || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const eventDateTime = formData.time 
        ? `${formData.date}T${formData.time}:00`
        : `${formData.date}T00:00:00`;

      const eventData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        eventDate: eventDateTime,
        category: formData.category,
        price: formData.price ? parseFloat(formData.price) : 0,
        capacity: formData.capacity ? parseInt(formData.capacity) : 100,
        imageUrl: formData.imageUrl || undefined,
      };

      console.log('🔄 Updating event:', eventData);
      
      await eventAPI.updateEvent(id!, eventData);

      toast.success(`Event "${formData.title}" updated successfully!`);
      navigate(`/events/${id}`);
      
    } catch (error) {
      console.error("❌ Event update error:", error);
      toast.error("Failed to update event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isFetching) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading event data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-purple-blue bg-clip-text text-transparent">
            Update Event
          </h1>
          <p className="text-muted-foreground">
            Modify the event details below
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Update the information for your event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concert">Concert</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="festival">Festival</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date & Time */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location *
                </Label>
                <Input
                  id="location"
                  placeholder="Enter event location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  required
                />
              </div>

              {/* Price & Capacity */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Ticket Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Capacity
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="100"
                    value={formData.capacity}
                    onChange={(e) => handleChange('capacity', e.target.value)}
                    min="1"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Event Image URL
                </Label>
                <Input
                  id="image"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" size="lg" className="flex-1" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Event'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(`/events/${id}`)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
