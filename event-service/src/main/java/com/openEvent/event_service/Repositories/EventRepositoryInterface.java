package com.openEvent.event_service.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.openEvent.event_service.Entities.Event;

@Repository
public interface EventRepositoryInterface extends JpaRepository<Event, Long> {
}
