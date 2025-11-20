package com.openEvent.event_service.Services;

import com.openEvent.event_service.Entities.Notification;
import com.openEvent.event_service.Repositories.NotificationRepositoryInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepositoryInterface notificationRepository;

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
    
    // =============================
    // KAFKA LISTENERS
    // =============================
    
    @KafkaListener(topics = "event-notifications", groupId = "notification-service-group")
    public void consumeEventNotification(Map<String, Object> message) {
        try {
            Notification notification = new Notification();
            notification.setTitle("New Event");
            notification.setMessage((String) message.get("message"));
            notification.setRecipient("all"); // Broadcast to all users
            notification.setSentAt(LocalDateTime.now());
            
            notificationRepository.save(notification);
        } catch (Exception e) {
            // Error saving notification - handle silently
        }
    }
    
    @KafkaListener(topics = "payment-notifications", groupId = "notification-service-group")
    public void consumePaymentNotification(Map<String, Object> message) {
        try {
            Long userId = ((Number) message.get("userId")).longValue();
            Notification notification = new Notification();
            notification.setTitle("Payment Successful");
            notification.setMessage((String) message.get("message"));
            notification.setRecipient("user:" + userId);
            notification.setSentAt(LocalDateTime.now());
            
            notificationRepository.save(notification);
        } catch (Exception e) {
            // Error saving notification - handle silently
        }
    }
}