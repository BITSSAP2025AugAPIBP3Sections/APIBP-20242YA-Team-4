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
        ticket.setStatus("BOOKED");
        return ticketRepository.save(ticket);
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id).orElse(null);
    }

    public String cancelTicket(Long id) {
        Ticket ticket = getTicketById(id);
        if (ticket != null) {
            ticket.setStatus("CANCELLED");
            ticketRepository.save(ticket);
            return "Ticket cancelled successfully";
        }
        return "Ticket not found";
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
        return ticketRepository.findByUserId(userId);
    }

    public List<Ticket> getTicketsByEvent(Long eventId) {
        return ticketRepository.findByEventId(eventId);
    }
}
