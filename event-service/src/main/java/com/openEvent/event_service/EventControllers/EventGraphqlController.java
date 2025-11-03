package com.openEvent.event_service.EventControllers;


import com.openEvent.event_service.EventEntity.Event;
import com.openEvent.event_service.EventServices.EventService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class EventGraphqlController {
    private final EventService eventService;

    public EventGraphqlController(EventService eventService) {
        this.eventService = eventService;
    }

    @QueryMapping
    public List<Event> events() {
        return eventService.getAllEvents();
    }

    @QueryMapping
    public Event eventById(@Argument Long id) {
        return eventService.getEventById(id);
    }
}