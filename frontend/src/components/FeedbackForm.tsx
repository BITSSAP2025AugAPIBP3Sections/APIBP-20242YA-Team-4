import { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { feedbackAPI } from '@/lib/api-service';
import { toast } from 'sonner';

interface FeedbackFormProps {
  eventId: string;
  eventTitle: string;
  existingFeedback?: {
    id: number;
    rating: number;
    comment: string;
  } | null;
  onSuccess?: () => void;
}

export const FeedbackForm = ({ eventId, eventTitle, existingFeedback, onSuccess }: FeedbackFormProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingFeedback?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingFeedback?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingFeedback) {
      setRating(existingFeedback.rating);
      setComment(existingFeedback.comment);
    }
  }, [existingFeedback]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    if (!user) {
      toast.error("Please login to submit feedback");
      return;
    }

    setIsSubmitting(true);

    try {
      if (existingFeedback) {
        // Update existing feedback
        await feedbackAPI.updateFeedback(existingFeedback.id, {
          rating,
          comment: comment.trim(),
        });
        toast.success("Feedback updated successfully!");
      } else {
        // Submit new feedback
        await feedbackAPI.submitFeedback({
          userId: parseInt(user.id),
          eventId: parseInt(eventId),
          comment: comment.trim(),
          rating,
        });
        toast.success("Thank you for your feedback!");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="cursor-pointer hover:scale-110 transition-transform"
          >
            <Star
              className={`h-6 w-6 ${
                star <= (hoveredRating || rating)
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
    <Card>
      <CardHeader>
        <CardTitle>{existingFeedback ? 'Update Your Review' : 'Write a Review'}</CardTitle>
        <CardDescription>Share your experience at {eventTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Rating *</label>
            <div className="flex items-center gap-4">
              {renderStars()}
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

          <Button type="submit" size="lg" disabled={isSubmitting}>
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Submitting...' : existingFeedback ? 'Update Review' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};