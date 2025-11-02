package com.openEvent.event_service.EventRepositories;

import com.openEvent.event_service.EventEntity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepositoryInterface extends JpaRepository<Event, Long> {
}
