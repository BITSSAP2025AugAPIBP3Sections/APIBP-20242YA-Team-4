package com.openEvent.event_service.Controllers;

import com.openEvent.event_service.Entities.Ticket;
import com.openEvent.event_service.Services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class TicketGraphqlController {

    @Autowired
    private TicketService ticketService;

    // Query: Get ticket by ID
    @QueryMapping
    public Ticket getTicketById(@Argument Long ticketId) {
        return ticketService.getTicketById(ticketId);
    }

    // Query: Get all tickets by User
    @QueryMapping
    public List<Ticket> getTicketsByUser(@Argument Long userId) {
        return ticketService.getTicketsByUser(userId);
    }

    // Query: Get all tickets by Event
    @QueryMapping
    public List<Ticket> getTicketsByEvent(@Argument Long eventId) {
        return ticketService.getTicketsByEvent(eventId);
    }

    // Mutation: Book Ticket
    @MutationMapping
    public Ticket bookTicket(
            @Argument Long userId,
            @Argument Long eventId,
            @Argument String seatNumber,
            @Argument Double price
    ) {
        Ticket ticket = new Ticket();
        ticket.setUserId(userId);
        ticket.setEventId(eventId);
        ticket.setSeatNumber(seatNumber);
        ticket.setPrice(price);
        return ticketService.bookTicket(ticket);
    }

    // Mutation: Cancel Ticket
    @MutationMapping
    public String cancelTicket(@Argument Long ticketId) {
        return ticketService.cancelTicket(ticketId);
    }
}
