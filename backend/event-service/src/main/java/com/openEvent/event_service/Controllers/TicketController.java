package com.openEvent.event_service.Controllers;

import com.openEvent.event_service.Entities.Ticket;
import com.openEvent.event_service.Services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "Ticket Controller", description = "Handles ticket booking, retrieval, and cancellation")
@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping("/book")
    @Operation(summary = "Book ticket", description = "Book a new ticket for an event.")
    public ResponseEntity<?> bookTicket(@RequestBody Ticket ticket) {
        try {
            Ticket created = ticketService.bookTicket(ticket);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to book ticket: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/{ticketId}")
    @Operation(summary = "Get ticket by ID", description = "Retrieve a ticket by its unique ID.")
    public ResponseEntity<?> getTicketById(@PathVariable Long ticketId) {
        try {
            Ticket ticket = ticketService.getTicketById(ticketId);
            return ResponseEntity.ok(ticket);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Ticket not found with ID: " + ticketId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve ticket: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/{ticketId}")
    @Operation(summary = "Cancel ticket", description = "Cancel a ticket by its unique ID.")
    public ResponseEntity<?> cancelTicket(@PathVariable Long ticketId) {
        try {
            String result = ticketService.cancelTicket(ticketId);
            Map<String, String> response = new HashMap<>();
            response.put("message", result);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to cancel ticket: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get tickets by user", description = "Retrieve all tickets booked by a specific user.")
    public ResponseEntity<?> getTicketsByUser(@PathVariable Long userId) {
        try {
            List<Ticket> tickets = ticketService.getTicketsByUser(userId);
            return ResponseEntity.ok(tickets);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "No tickets found for user ID: " + userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve tickets: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/events/{eventId}")
    @Operation(summary = "Get tickets by event", description = "Retrieve all tickets for a specific event.")
    public ResponseEntity<?> getTicketsByEvent(@PathVariable Long eventId) {
        try {
            List<Ticket> tickets = ticketService.getTicketsByEvent(eventId);
            return ResponseEntity.ok(tickets);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "No tickets found for event ID: " + eventId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve tickets: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
