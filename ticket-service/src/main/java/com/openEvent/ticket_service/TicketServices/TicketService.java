package com.openEvent.ticket_service.TicketServices;

import com.openEvent.ticket_service.TicketEntity.Ticket;
import com.openEvent.ticket_service.TicketRepositories.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

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

    public List<Ticket> getTicketsByUser(Long userId) {
        return ticketRepository.findByUserId(userId);
    }

    public List<Ticket> getTicketsByEvent(Long eventId) {
        return ticketRepository.findByEventId(eventId);
    }
}
