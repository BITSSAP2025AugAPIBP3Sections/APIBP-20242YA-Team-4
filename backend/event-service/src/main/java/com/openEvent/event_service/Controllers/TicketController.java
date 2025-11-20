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
    public Ticket bookTicket(@RequestBody Ticket ticket) {
        return ticketService.bookTicket(ticket);
    }

    @GetMapping("/{ticketId}")
    @Operation(summary = "Get ticket by ID", description = "Retrieve a ticket by its unique ID.")
    public Ticket getTicketById(@PathVariable Long ticketId) {
        return ticketService.getTicketById(ticketId);
    }

    @DeleteMapping("/{ticketId}")
    @Operation(summary = "Cancel ticket", description = "Cancel a ticket by its unique ID.")
    public String cancelTicket(@PathVariable Long ticketId) {
        return ticketService.cancelTicket(ticketId);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get tickets by user", description = "Retrieve all tickets booked by a specific user.")
    public List<Ticket> getTicketsByUser(@PathVariable Long userId) {
        return ticketService.getTicketsByUser(userId);
    }

    @GetMapping("/events/{eventId}")
    @Operation(summary = "Get tickets by event", description = "Retrieve all tickets for a specific event.")
    public List<Ticket> getTicketsByEvent(@PathVariable Long eventId) {
        return ticketService.getTicketsByEvent(eventId);
    }
}
