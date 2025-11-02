package com.openEvent.event_service.EventServices;

import com.openEvent.event_service.EventEntity.Event;
import com.openEvent.event_service.EventRepositories.EventRepositoryInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
    @Autowired
    private final EventRepositoryInterface eventRepository;

    public EventService(EventRepositoryInterface eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
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
