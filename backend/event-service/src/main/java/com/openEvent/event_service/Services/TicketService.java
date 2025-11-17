package com.openEvent.event_service.Services;

import com.openEvent.event_service.Entities.Ticket;
import com.openEvent.event_service.Repositories.TicketRepositoryInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepositoryInterface ticketRepository;

    public Ticket bookTicket(Ticket ticket) {
        // User ID validations
        if (ticket.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required and cannot be null");
        }
        if (ticket.getUserId() <= 0) {
            throw new IllegalArgumentException("User ID must be a positive number");
        }

        // Event ID validations
        if (ticket.getEventId() == null) {
            throw new IllegalArgumentException("Event ID is required and cannot be null");
        }
        if (ticket.getEventId() <= 0) {
            throw new IllegalArgumentException("Event ID must be a positive number");
        }

        ticket.setStatus("BOOKED");
        return ticketRepository.save(ticket);
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with ID: " + id));
    }

    public String cancelTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with ID: " + id));

        if ("CANCELLED".equals(ticket.getStatus())) {
            throw new RuntimeException("Ticket is already cancelled");
        }

        ticket.setStatus("CANCELLED");
        ticketRepository.save(ticket);
        return "Ticket cancelled successfully";
    }

    public Ticket createPendingTicket(Long userId, Long eventId, String seatNumber, Double price) {
        Ticket ticket = new Ticket();
        ticket.setUserId(userId);
        ticket.setEventId(eventId);
        ticket.setSeatNumber(seatNumber);
        ticket.setPrice(price);
        ticket.setStatus("PENDING");
        return ticketRepository.save(ticket);
    }

    public Ticket updateStatus(Long ticketId, String status) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));
        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getTicketsByUser(Long userId) {
        List<Ticket> tickets = ticketRepository.findByUserId(userId);
        if (tickets.isEmpty()) {
            throw new RuntimeException("No tickets found for User ID: " + userId);
        }
        return tickets;
    }

    public List<Ticket> getTicketsByEvent(Long eventId) {
        List<Ticket> tickets = ticketRepository.findByEventId(eventId);
        if (tickets.isEmpty()) {
            throw new RuntimeException("No tickets found for Event ID: " + eventId);
        }
        return tickets;
    }
}
