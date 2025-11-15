package com.openEvent.event_service.Services;

import com.openEvent.event_service.Entities.Notification;
import com.openEvent.event_service.Repositories.NotificationRepositoryInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepositoryInterface notificationRepository;

    @Autowired
    public NotificationService(NotificationRepositoryInterface notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Notification getNotificationById(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id " + id));
    }

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public Notification updateNotification(Long id, Notification notificationDetails) {
        Notification existing = getNotificationById(id);
        existing.setTitle(notificationDetails.getTitle());
        existing.setMessage(notificationDetails.getMessage());
        existing.setRecipient(notificationDetails.getRecipient());
        existing.setSentAt(notificationDetails.getSentAt());
        return notificationRepository.save(existing);
    }

    public void deleteNotification(Long id) {
        Notification existing = getNotificationById(id);
        notificationRepository.delete(existing);
    }

    // New helper method for saga usage
    public Notification sendBookingNotification(Long userId, String title, String message) {
        String recipient = "user:" + userId; 
        Notification n = new Notification();
        n.setTitle(title);
        n.setMessage(message);
        n.setRecipient(recipient);
        // The sentAt will be set by @CreationTimestamp, here this is gonna be setup
        return notificationRepository.save(n);
    }
}