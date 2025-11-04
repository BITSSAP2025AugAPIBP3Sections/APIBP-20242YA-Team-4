package com.openEvent.event_service.Repositories;

import com.openEvent.event_service.Entities.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepositoryInterface extends JpaRepository<Feedback, Long> {
    List<Feedback> findByEventId(Long eventId);
    List<Feedback> findByUserId(Long userId);
    List<Feedback> findByEventIdOrderByCreatedAtDesc(Long eventId);
    List<Feedback> findByUserIdOrderByCreatedAtDesc(Long userId);
}