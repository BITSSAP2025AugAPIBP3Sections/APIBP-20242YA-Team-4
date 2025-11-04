package com.openEvent.event_service.Controllers;

import com.openEvent.event_service.Entities.Notification;
import com.openEvent.event_service.Services.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class NotificationGraphqlController{
    @Autowired
    private final NotificationService notificationService;

    public NotificationGraphqlController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @QueryMapping
    public List<Notification> notifications() {
        return notificationService.getAllNotifications();
    }

    @QueryMapping
    public Notification notificationById(@Argument Long id) {
        return notificationService.getNotificationById(id);
    }
}