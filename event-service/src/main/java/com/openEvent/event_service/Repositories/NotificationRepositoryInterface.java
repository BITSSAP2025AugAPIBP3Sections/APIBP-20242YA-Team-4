package com.openEvent.event_service.Repositories;

import com.openEvent.event_service.Entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepositoryInterface extends JpaRepository<Notification, Long> {
}