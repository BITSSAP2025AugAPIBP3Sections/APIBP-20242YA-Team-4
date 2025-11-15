package com.openEvent.event_service.Controllers;

import com.openEvent.event_service.Entities.Ticket;
import com.openEvent.event_service.Services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping("/book")
    public ResponseEntity<?> bookTicket(@RequestBody Ticket ticket) {
        try {
            Ticket created = ticketService.bookTicket(ticket);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to book ticket: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<?> getTicketById(@PathVariable Long ticketId) {
        try {
            Ticket ticket = ticketService.getTicketById(ticketId);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch ticket with id " + ticketId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @DeleteMapping("/{ticketId}")
    public ResponseEntity<?> cancelTicket(@PathVariable Long ticketId) {
        try {
            String result = ticketService.cancelTicket(ticketId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to cancel ticket with id " + ticketId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getTicketsByUser(@PathVariable Long userId) {
        try {
            List<Ticket> tickets = ticketService.getTicketsByUser(userId);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get tickets for user " + userId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<?> getTicketsByEvent(@PathVariable Long eventId) {
        try {
            List<Ticket> tickets = ticketService.getTicketsByEvent(eventId);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get tickets for event " + eventId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
