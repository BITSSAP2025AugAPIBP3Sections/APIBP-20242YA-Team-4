package com.openEvent.event_service.Services;

import com.openEvent.event_service.Entities.Feedback;
import com.openEvent.event_service.Repositories.FeedbackRepositoryInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepositoryInterface feedbackRepository;

    public Feedback submitFeedback(Long userId, Long eventId, String comment, Integer rating) {
        // Validate rating is between 1-5
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        
        Feedback feedback = new Feedback(userId, eventId, comment, rating);
        return feedbackRepository.save(feedback);
    }

    public Optional<Feedback> getFeedbackById(Long id) {
        return feedbackRepository.findById(id);
    }

    public List<Feedback> getFeedbackByEvent(Long eventId) {
        return feedbackRepository.findByEventIdOrderByCreatedAtDesc(eventId);
    }

    public List<Feedback> getFeedbackByUser(Long userId) {
        return feedbackRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Feedback updateFeedback(Long id, String comment, Integer rating) {
        Optional<Feedback> feedbackOptional = feedbackRepository.findById(id);
        if (feedbackOptional.isPresent()) {
            Feedback feedback = feedbackOptional.get();
            
            if (comment != null) {
                feedback.setComment(comment);
            }
            if (rating != null) {
                if (rating < 1 || rating > 5) {
                    throw new IllegalArgumentException("Rating must be between 1 and 5");
                }
                feedback.setRating(rating);
            }
            feedback.setUpdatedAt(LocalDateTime.now());
            
            return feedbackRepository.save(feedback);
        }
        throw new RuntimeException("Feedback not found with id: " + id);
    }

    public boolean deleteFeedback(Long id) {
        if (feedbackRepository.existsById(id)) {
            feedbackRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }
}