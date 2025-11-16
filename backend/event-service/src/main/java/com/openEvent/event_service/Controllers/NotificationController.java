package com.openEvent.event_service.Controllers;

import com.openEvent.event_service.Entities.Notification;
import com.openEvent.event_service.Services.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {
    @Autowired
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<?> getAllNotifications() {
        try {
            List<Notification> notifications = notificationService.getAllNotifications();
            return ResponseEntity.ok(notifications);
        } catch (Exception ex) {
            return handleException(ex);
        }
    }

    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody Notification notification) {
        try {
            Notification created = notificationService.createNotification(notification);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception ex) {
            return handleException(ex);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getNotificationById(@PathVariable Long id) {
        try {
            Notification notification = notificationService.getNotificationById(id);
            return ResponseEntity.ok(notification);
        } catch (Exception ex) {
            return handleException(ex);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNotification(@PathVariable Long id, @RequestBody Notification notificationDetails) {
        try {
            Notification updated = notificationService.updateNotification(id, notificationDetails);
            return ResponseEntity.ok(updated);
        } catch (Exception ex) {
            return handleException(ex);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        try {
            notificationService.deleteNotification(id);
            return ResponseEntity.noContent().build();
        } catch (Exception ex) {
            return handleException(ex);
        }
    }

    private ResponseEntity<Map<String, String>> handleException(Exception ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "An unexpected error occurred");
        errorResponse.put("details", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
