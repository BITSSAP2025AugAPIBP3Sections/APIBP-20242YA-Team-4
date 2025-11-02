import { useState } from 'react';
import { Star, Send, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/context/NotificationContext';

interface Review {
  id: string;
  userName: string;
  eventName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

const mockReviews: Review[] = [
  {
    id: '1',
    userName: 'Sarah Johnson',
    eventName: 'Tech Summit 2024',
    rating: 5,
    comment: 'Amazing event! Great speakers and networking opportunities. Highly recommend!',
    date: '2024-01-15',
    helpful: 12,
  },
  {
    id: '2',
    userName: 'Mike Chen',
    eventName: 'Summer Music Fest',
    rating: 4,
    comment: 'Fantastic lineup and great atmosphere. The venue was a bit crowded but overall excellent experience.',
    date: '2024-01-14',
    helpful: 8,
  },
  {
    id: '3',
    userName: 'Emily Davis',
    eventName: 'Startup Workshop',
    rating: 5,
    comment: 'Very informative and well-organized. Learned a lot about entrepreneurship!',
    date: '2024-01-13',
    helpful: 15,
  },
];

export default function FeedbackPage() {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews] = useState<Review[]>(mockReviews);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please write a review",
        variant: "destructive",
      });
      return;
    }

    addNotification({
      type: 'success',
      message: 'Thank you for your feedback!'
    });

    toast({
      title: "Review Submitted!",
      description: "Thank you for sharing your experience.",
    });

    setRating(0);
    setComment('');
  };

  const renderStars = (currentRating: number, isInteractive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={isInteractive ? 'button' : undefined}
            onClick={isInteractive ? () => setRating(star) : undefined}
            onMouseEnter={isInteractive ? () => setHoveredRating(star) : undefined}
            onMouseLeave={isInteractive ? () => setHoveredRating(0) : undefined}
            disabled={!isInteractive}
            className={`${isInteractive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star
              className={`h-6 w-6 ${
                star <= (isInteractive ? (hoveredRating || rating) : currentRating)
                  ? 'fill-accent text-accent'
                  : 'text-muted-foreground'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-purple-blue bg-clip-text text-transparent">
            Event Feedback
          </h1>
          <p className="text-muted-foreground">
            Share your experience and help others discover great events
          </p>
        </div>

        {/* Submit Review Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
            <CardDescription>Rate your recent event experience</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Rating *</label>
                <div className="flex items-center gap-4">
                  {renderStars(rating, true)}
                  {rating > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {rating} {rating === 1 ? 'star' : 'stars'}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="comment" className="text-sm font-medium">
                  Your Review *
                </label>
                <Textarea
                  id="comment"
                  placeholder="Tell us about your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full md:w-auto">
                <Send className="mr-2 h-4 w-4" />
                Submit Review
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Recent Reviews</h2>
          
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="gradient-purple-blue text-white">
                        {review.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{review.userName}</p>
                      <p className="text-sm text-muted-foreground">{review.eventName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {renderStars(review.rating)}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">{review.comment}</p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Button variant="ghost" size="sm" className="h-8">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful ({review.helpful})
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
