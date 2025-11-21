package com.openEvent.event_service.Services;

import com.openEvent.event_service.Entities.Event;
import com.openEvent.event_service.Repositories.EventRepositoryInterface;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EventService {
    private final EventRepositoryInterface eventRepository;
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

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
        Event saved = eventRepository.save(event);
        
        // Send Kafka notification
        try {
            Map<String, Object> notification = new HashMap<>();
            notification.put("eventId", saved.getId());
            notification.put("eventName", saved.getTitle());
            notification.put("message", "New event - " + saved.getTitle() + " added just now!");
            notification.put("type", "info");
            
            kafkaTemplate.send("event-notifications", notification);
        } catch (Exception e) {
            // Kafka send failed - log or handle silently
        }
        
        return saved;
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Event existing = getEventById(id);
        existing.setTitle(eventDetails.getTitle());
        existing.setDescription(eventDetails.getDescription());
        existing.setLocation(eventDetails.getLocation());
        existing.setEventDate(eventDetails.getEventDate());
        existing.setPrice(eventDetails.getPrice());
        existing.setCapacity(eventDetails.getCapacity());
        existing.setCategory(eventDetails.getCategory());
        existing.setImageUrl(eventDetails.getImageUrl());
        return eventRepository.save(existing);
    }

    public void deleteEvent(Long id) {
        Event existing = getEventById(id);
        eventRepository.delete(existing);
    }
}