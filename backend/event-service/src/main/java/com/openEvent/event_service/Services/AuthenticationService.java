package com.openEvent.event_service.Services;

import com.openEvent.event_service.Entities.User;
import com.openEvent.event_service.Entities.Role;
import com.openEvent.event_service.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public User register(String username, String email, String password, String fullName, String roleStr) {
        System.out.println("Registering user: " + username + " with email: " + email);
        
        // Check if user already exists
        if (userRepository.findByUsername(username) != null) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setFullName(fullName != null ? fullName : username);
        
        // Set role (default to ATTENDEE if not specified)
        Role role = Role.ATTENDEE;
        if (roleStr != null) {
            try {
                role = Role.valueOf(roleStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Keep default role if invalid role provided
            }
        }
        user.setRole(role);
        
        // Encode password
        String encodedPassword = passwordEncoder.encode(password);
        user.setPassword(encodedPassword);
        user.setVerified(true); // For simplicity, auto-verify
        
        System.out.println("Saving user with role: " + role);
        return userRepository.save(user);
    }

    public boolean validateUserCredentials(String username, String password) {
        System.out.println("Validating credentials for: " + username);
        
        User user = userRepository.findByUsername(username);
        if (user == null) {
            System.out.println("User not found: " + username);
            return false;
        }
        
        boolean matches = passwordEncoder.matches(password, user.getPassword());
        System.out.println("Password validation result: " + matches);
        return matches;
    }

    public String generateToken(String username) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            return jwtService.generateToken(username, user.getRole().toString());
        }
        return jwtService.generateToken(username);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}

