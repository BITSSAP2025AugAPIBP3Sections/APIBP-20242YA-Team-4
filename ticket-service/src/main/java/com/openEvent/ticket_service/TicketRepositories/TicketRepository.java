package com.openEvent.ticket_service.TicketRepositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openEvent.ticket_service.TicketEntity.Ticket;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUserId(Long userId);
    List<Ticket> findByEventId(Long eventId);
}
