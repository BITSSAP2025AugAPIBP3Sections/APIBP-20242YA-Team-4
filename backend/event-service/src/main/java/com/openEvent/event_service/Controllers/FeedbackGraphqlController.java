package com.openEvent.event_service.Controllers;

import com.openEvent.event_service.Entities.Feedback;
import com.openEvent.event_service.Services.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Optional;

@Controller
public class FeedbackGraphqlController {

    @Autowired
    private FeedbackService feedbackService;

    @QueryMapping
    public Optional<Feedback> feedback(@Argument Long id) {
        return feedbackService.getFeedbackById(id);
    }

    @QueryMapping
    public List<Feedback> feedbackByEvent(@Argument Long eventId) {
        return feedbackService.getFeedbackByEvent(eventId);
    }

    @QueryMapping
    public List<Feedback> feedbackByUser(@Argument Long userId) {
        return feedbackService.getFeedbackByUser(userId);
    }

    @MutationMapping
    public Boolean deleteFeedback(@Argument Long id) {
        return feedbackService.deleteFeedback(id);
    }
}