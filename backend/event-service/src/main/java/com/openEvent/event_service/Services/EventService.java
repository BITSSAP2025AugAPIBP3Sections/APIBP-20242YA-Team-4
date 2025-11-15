package com.openEvent.event_service.Services;

import com.openEvent.event_service.Entities.Event;
import com.openEvent.event_service.Repositories.EventRepositoryInterface;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class EventService {
    private final EventRepositoryInterface eventRepository;

    @Autowired
    public EventService(EventRepositoryInterface eventRepository) {
        this.eventRepository = eventRepository;
    }

    @CircuitBreaker(name = "eventServiceCB", fallbackMethod = "fallbackGetAllEvents")
    public List<Event> getAllEvents(boolean forceFail) {
        if (forceFail) {
            throw new RuntimeException("Forced failure for testing circuit breaker");
        }
        return eventRepository.findAll();
    }

    public List<Event> fallbackGetAllEvents(boolean forceFail, Throwable t) {
        System.out.println("Fallback executed due to: " + t.getMessage());
        return Collections.emptyList();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id " + id));
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Event existing = getEventById(id);
        existing.setTitle(eventDetails.getTitle());
        existing.setDescription(eventDetails.getDescription());
        existing.setLocation(eventDetails.getLocation());
        existing.setEventDate(eventDetails.getEventDate());
        return eventRepository.save(existing);
    }

    public void deleteEvent(Long id) {
        Event existing = getEventById(id);
        eventRepository.delete(existing);
    }
}