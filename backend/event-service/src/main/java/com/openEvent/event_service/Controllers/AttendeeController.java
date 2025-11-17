package com.openEvent.event_service.Controllers;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Tag(name = "Attendee Controller", description = "Handles attendee profile operations")
@RestController
@RequestMapping("/api/v1/attendees")
@CrossOrigin(origins = "*")
public class AttendeeController {

    @Autowired
    private com.openEvent.event_service.Services.AttendeeService attendeeService;

    @GetMapping
    @Operation(summary = "Get all attendees", description = "Retrieve a list of all attendees.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Attendees retrieved successfully")
    })
    public ResponseEntity<List<com.openEvent.event_service.Entities.Attendee>> getAllAttendees() {
        try {
            List<com.openEvent.event_service.Entities.Attendee> attendees = attendeeService.getAllAttendees();
            return ResponseEntity.ok(attendees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get attendee by ID", description = "Retrieve an attendee by their unique ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Attendee retrieved successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.openEvent.event_service.Entities.Attendee.class))),
            @ApiResponse(responseCode = "404", description = "Attendee not found")
    })
    public ResponseEntity<?> getAttendeeById(@PathVariable Long id) {
        try {
            Optional<com.openEvent.event_service.Entities.Attendee> attendee = attendeeService.getAttendeeById(id);
            if (attendee.isPresent()) {
                return ResponseEntity.ok(attendee.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Attendee not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch Attendee: " + e.getMessage()));
        }
    }

    @GetMapping("/username/{username}")
    @Operation(summary = "Get attendee by username", description = "Retrieve an attendee by their username.")
    public ResponseEntity<?> getAttendeeByUsername(@PathVariable String username) {
        try {
            com.openEvent.event_service.Entities.Attendee attendee = attendeeService.getAttendeeByUsername(username);
            if (attendee != null) {
                return ResponseEntity.ok(attendee);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Attendee not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch Attendee: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/profile")
    @Operation(summary = "Update attendee profile", description = "Update the profile information of an attendee.")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(
                            value = "{\n" +
                                    "  \"fullName\": \"Updated Name\",\n" +
                                    "  \"email\": \"newemail@example.com\"\n" +
                                    "}"
                    )
            )
    )
    public ResponseEntity<?> updateAttendeeProfile(@PathVariable Long id, @RequestBody Map<String, String> updateRequest) {
        try {
            String fullName = updateRequest.get("fullName");
            String email = updateRequest.get("email");

            com.openEvent.event_service.Entities.Attendee updatedAttendee = attendeeService.updateAttendeeProfile(id, fullName, email);
            return ResponseEntity.ok(Map.of(
                    "message", "Profile updated successfully",
                    "attendee", updatedAttendee
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to update profile: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/password")
    @Operation(summary = "Change attendee password", description = "Change the password for an attendee.")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(
                            value = "{\n" +
                                    "  \"currentPassword\": \"oldpassword\",\n" +
                                    "  \"newPassword\": \"newpassword123\"\n" +
                                    "}"
                    )
            )
    )
    public ResponseEntity<?> changeAttendeePassword(@PathVariable Long id, @RequestBody Map<String, String> passwordRequest) {
        try {
            String currentPassword = passwordRequest.get("currentPassword");
            String newPassword = passwordRequest.get("newPassword");

            boolean success = attendeeService.changeAttendeePassword(id, currentPassword, newPassword);
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Current password is incorrect"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to change password: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete attendee", description = "Delete an attendee by their unique ID.")
    public ResponseEntity<?> deleteAttendee(@PathVariable Long id) {
        try {
            attendeeService.deleteAttendee(id);
            return ResponseEntity.ok(Map.of("message", "Attendee deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to delete Attendee: " + e.getMessage()));
        }
    }
}
