package com.openEvent.event_service.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openEvent.event_service.Entities.Ticket;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUserId(Long userId);
    List<Ticket> findByEventId(Long eventId);
}
