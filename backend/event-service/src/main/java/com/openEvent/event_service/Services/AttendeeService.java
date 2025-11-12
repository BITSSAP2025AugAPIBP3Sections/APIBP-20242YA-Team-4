package com.openEvent.event_service.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AttendeeService {

    @Autowired
    private com.openEvent.event_service.Repositories.AttendeeRepository attendeeRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<com.openEvent.event_service.Entities.Attendee> getUserByEmail(String email) {
        return attendeeRepository.findByEmail(email);
    }

    public Optional<com.openEvent.event_service.Entities.Attendee> getUserById(Long id) {
        return attendeeRepository.findById(id);
    }

    public com.openEvent.event_service.Entities.Attendee getUserByUsername(String username) {
        return attendeeRepository.findByUsername(username);
    }

    public List<com.openEvent.event_service.Entities.Attendee> getAllUsers() {
        return attendeeRepository.findAll();
    }

    public com.openEvent.event_service.Entities.Attendee updateUserProfile(Long id, String fullName, String email) {
        Optional<com.openEvent.event_service.Entities.Attendee> userOptional = attendeeRepository.findById(id);
        if (userOptional.isPresent()) {
            com.openEvent.event_service.Entities.Attendee attendee = userOptional.get();
            
            if (fullName != null) {
                attendee.setFullName(fullName);
            }
            if (email != null && !email.equals(attendee.getEmail())) {
                if (attendeeRepository.existsByEmail(email)) {
                    throw new RuntimeException("Email already exists");
                }
                attendee.setEmail(email);
            }
            attendee.setUpdatedAt(LocalDateTime.now());
            
            return attendeeRepository.save(attendee);
        }
        throw new RuntimeException("User not found with id: " + id);
    }

    public boolean changePassword(Long id, String currentPassword, String newPassword) {
        Optional<com.openEvent.event_service.Entities.Attendee> userOptional = attendeeRepository.findById(id);
        if (userOptional.isPresent()) {
            com.openEvent.event_service.Entities.Attendee attendee = userOptional.get();
            
            if (!passwordEncoder.matches(currentPassword, attendee.getPassword())) {
                return false;
            }
            
            String encodedPassword = passwordEncoder.encode(newPassword);
            attendee.setPassword(encodedPassword);
            attendee.setUpdatedAt(LocalDateTime.now());
            attendeeRepository.save(attendee);
            return true;
        }
        throw new RuntimeException("User not found with id: " + id);
    }

    public void deleteUser(Long id) {
        if (attendeeRepository.existsById(id)) {
            attendeeRepository.deleteById(id);
        } else {
            throw new RuntimeException("User not found with id: " + id);
        }
    }
}
