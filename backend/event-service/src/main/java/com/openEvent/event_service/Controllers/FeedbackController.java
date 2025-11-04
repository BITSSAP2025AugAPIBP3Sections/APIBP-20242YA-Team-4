package com.openEvent.event_service.Controllers;

import com.openEvent.event_service.Entities.Feedback;
import com.openEvent.event_service.Services.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Feedback submitted successfully",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Feedback.class))),
        @ApiResponse(responseCode = "400", description = "Bad request")
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
        content = @Content(
            mediaType = "application/json",
            examples = @ExampleObject(
                value = "{\n" +
                       "  \"userId\": 1,\n" +
                       "  \"eventId\": 1,\n" +
                       "  \"comment\": \"Great event! Really enjoyed it.\",\n" +
                       "  \"rating\": 5\n" +
                       "}"
            )
        )
    )
    public ResponseEntity<?> submitFeedback(@RequestBody Map<String, Object> feedbackRequest) {
        try {
            Long userId = Long.valueOf(feedbackRequest.get("userId").toString());
            Long eventId = Long.valueOf(feedbackRequest.get("eventId").toString());
            String comment = feedbackRequest.get("comment").toString();
            Integer rating = Integer.valueOf(feedbackRequest.get("rating").toString());

            Feedback feedback = feedbackService.submitFeedback(userId, eventId, comment, rating);
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to submit feedback: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Feedback retrieved successfully",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Feedback.class))),
        @ApiResponse(responseCode = "404", description = "Feedback not found")
    })
    public ResponseEntity<?> getFeedbackById(@PathVariable Long id) {
        try {
            Optional<Feedback> feedback = feedbackService.getFeedbackById(id);
            if (feedback.isPresent()) {
                return ResponseEntity.ok(feedback.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Feedback not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch feedback: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Feedback updated successfully",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Feedback.class))),
        @ApiResponse(responseCode = "404", description = "Feedback not found"),
        @ApiResponse(responseCode = "400", description = "Bad request")
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
        content = @Content(
            mediaType = "application/json",
            examples = @ExampleObject(
                value = "{\n" +
                       "  \"comment\": \"Updated comment\",\n" +
                       "  \"rating\": 4\n" +
                       "}"
            )
        )
    )
    public ResponseEntity<?> updateFeedback(@PathVariable Long id, @RequestBody Map<String, Object> updateRequest) {
        try {
            String comment = updateRequest.get("comment") != null ? updateRequest.get("comment").toString() : null;
            Integer rating = updateRequest.get("rating") != null ? Integer.valueOf(updateRequest.get("rating").toString()) : null;

            Feedback updatedFeedback = feedbackService.updateFeedback(id, comment, rating);
            return ResponseEntity.ok(updatedFeedback);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to update feedback: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Feedback deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Feedback not found")
    })
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        try {
            boolean deleted = feedbackService.deleteFeedback(id);
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "Feedback deleted successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Feedback not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete feedback: " + e.getMessage()));
        }
    }
}