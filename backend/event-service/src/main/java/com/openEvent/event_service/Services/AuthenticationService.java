package com.openEvent.event_service.Services;

import com.openEvent.event_service.Entities.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    private com.openEvent.event_service.Repositories.AttendeeRepository attendeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public com.openEvent.event_service.Entities.Attendee register(String username, String email, String password, String fullName, String roleStr) {
        System.out.println("Registering user: " + username + " with email: " + email);
        
        // Check if user already exists
        if (attendeeRepository.findByUsername(username) != null) {
            throw new RuntimeException("Username already exists");
        }
        if (attendeeRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        com.openEvent.event_service.Entities.Attendee attendee = new com.openEvent.event_service.Entities.Attendee();
        attendee.setUsername(username);
        attendee.setEmail(email);
        attendee.setFullName(fullName != null ? fullName : username);
        
        // Set role (default to ATTENDEE if not specified)
        Role role = Role.ATTENDEE;
        if (roleStr != null) {
            try {
                role = Role.valueOf(roleStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Keep default role if invalid role provided
            }
        }
        attendee.setRole(role);
        
        // Encode password
        String encodedPassword = passwordEncoder.encode(password);
        attendee.setPassword(encodedPassword);
        attendee.setVerified(true); // For simplicity, auto-verify
        
        System.out.println("Saving user with role: " + role);
        return attendeeRepository.save(attendee);
    }

    public boolean validateUserCredentials(String username, String password) {
        System.out.println("Validating credentials for: " + username);
        
        com.openEvent.event_service.Entities.Attendee attendee = attendeeRepository.findByUsername(username);
        if (attendee == null) {
            System.out.println("User not found: " + username);
            return false;
        }
        
        boolean matches = passwordEncoder.matches(password, attendee.getPassword());
        System.out.println("Password validation result: " + matches);
        return matches;
    }

    public String generateToken(String username) {
        com.openEvent.event_service.Entities.Attendee attendee = attendeeRepository.findByUsername(username);
        if (attendee != null) {
            return jwtService.generateToken(username, attendee.getRole().toString());
        }
        return jwtService.generateToken(username);
    }

    public com.openEvent.event_service.Entities.Attendee getUserByUsername(String username) {
        return attendeeRepository.findByUsername(username);
    }
}

