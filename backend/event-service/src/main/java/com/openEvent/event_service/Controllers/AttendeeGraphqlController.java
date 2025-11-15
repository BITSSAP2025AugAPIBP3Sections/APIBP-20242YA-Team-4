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
    public List<com.openEvent.event_service.Entities.Attendee> getAllAttendees() {
        return attendeeService.getAllAttendees();
    }

    @QueryMapping
    public Optional<com.openEvent.event_service.Entities.Attendee> getAttendeeById(@Argument Long id) {
        return attendeeService.getAttendeeById(id);
    }

    @QueryMapping
    public com.openEvent.event_service.Entities.Attendee getAttendeeByUsername(@Argument String username) {
        return attendeeService.getAttendeeByUsername(username);
    }

    @QueryMapping
    public Optional<com.openEvent.event_service.Entities.Attendee> getAttendeeByEmail(@Argument String email) {
        return attendeeService.getAttendeeByEmail(email);
    }
}
