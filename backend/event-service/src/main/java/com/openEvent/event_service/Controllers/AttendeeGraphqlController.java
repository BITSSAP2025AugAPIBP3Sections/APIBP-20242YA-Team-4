package com.openEvent.event_service.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Optional;

@Controller
public class AttendeeGraphqlController {

    @Autowired
    private com.openEvent.event_service.Services.AttendeeService attendeeService;

    @QueryMapping
    public List<com.openEvent.event_service.Entities.Attendee> getAllUsers() {
        return attendeeService.getAllUsers();
    }

    @QueryMapping
    public Optional<com.openEvent.event_service.Entities.Attendee> getUserById(@Argument Long id) {
        return attendeeService.getUserById(id);
    }

    @QueryMapping
    public com.openEvent.event_service.Entities.Attendee getUserByUsername(@Argument String username) {
        return attendeeService.getUserByUsername(username);
    }

    @QueryMapping
    public Optional<com.openEvent.event_service.Entities.Attendee> getUserByEmail(@Argument String email) {
        return attendeeService.getUserByEmail(email);
    }
}