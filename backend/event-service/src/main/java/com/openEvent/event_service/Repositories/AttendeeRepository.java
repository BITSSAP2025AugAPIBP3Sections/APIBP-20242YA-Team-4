package com.openEvent.event_service.Repositories;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface AttendeeRepository extends JpaRepository<com.openEvent.event_service.Entities.Attendee, Long> {
    Optional<com.openEvent.event_service.Entities.Attendee> findByEmail(String email);
    boolean existsByEmail(String email);
    com.openEvent.event_service.Entities.Attendee findByUsername(String username);
    boolean existsByUsername(String username);
}
