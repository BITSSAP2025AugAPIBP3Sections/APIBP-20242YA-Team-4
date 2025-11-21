package com.openEvent.event_service.Controllers;

import com.openEvent.event_service.Services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

import java.util.Map;

@Tag(name = "Authentication Controller", description = "Handles user login and registration")
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationService authService;

    @PostMapping("/login")
    @Operation(summary = "User Login", description = "Authenticates user and returns a JWT token with user details.")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
        content = @Content(
            mediaType = "application/json",
            examples = @ExampleObject(
                value = "{\n" +
                       "  \"username\": \"testuser\",\n" +
                       "  \"password\": \"testpassword\"\n" +
                       "}"
            )
        )
    )
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");
            
            System.out.println("Login attempt for username: " + username); // Debug log
            
            if (authService.validateUserCredentials(username, password)) {
                String token = authService.generateToken(username);
                com.openEvent.event_service.Entities.Attendee attendee = authService.getUserByUsername(username);
                return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "token", token,
                    "user", Map.of(
                        "id", attendee.getId(),
                        "username", attendee.getUsername(),
                        "email", attendee.getEmail(),
                        "fullName", attendee.getFullName() != null ? attendee.getFullName() : "",
                        "role", attendee.getRole().toString(),
                        "verified", attendee.isVerified()
                    )
                ));
            } else {
                System.out.println("Invalid credentials for username: " + username); // Debug log
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid credentials"));
            }
        } catch (Exception e) {
            System.out.println("Login error: " + e.getMessage()); // Debug log
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/signup")
    @Operation(summary = "User Registration", description = "Registers a new user and returns user details.")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
        content = @Content(
            mediaType = "application/json",
            examples = @ExampleObject(
                value = "{\n" +
                       "  \"username\": \"john_doe\",\n" +
                       "  \"email\": \"john@example.com\",\n" +
                       "  \"password\": \"password123\",\n" +
                       "  \"fullName\": \"John Doe\",\n" +
                       "  \"role\": \"ATTENDEE\"\n" +
                       "}"
            )
        )
    )
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest) {
        try {
            String username = registerRequest.get("username");
            String email = registerRequest.get("email");
            String password = registerRequest.get("password");
            String fullName = registerRequest.get("fullName");
            String role = registerRequest.getOrDefault("role", "ATTENDEE"); // Default to ATTENDEE

            // Email validation
            if (email == null || email.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Email is required"));
            }
            // Basic email validation
            String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
            if (!email.matches(emailRegex)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Please enter a valid email address"));
            }

            System.out.println("Registration attempt for username: " + username + ", email: " + email + ", role: " + role);

            com.openEvent.event_service.Entities.Attendee attendee = authService.register(username, email, password, fullName, role);
            return ResponseEntity.ok(Map.of(
                "message", "Attendee registered successfully!",
                "id", attendee.getId(),
                "username", attendee.getUsername(),
                "email", attendee.getEmail(),
                "fullName", attendee.getFullName() != null ? attendee.getFullName() : "",
                "role", attendee.getRole().toString(),
                "verified", attendee.isVerified()
                // NOTE: Never include password in response for security reasons
            ));
        } catch (Exception e) {
            System.out.println("Registration error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }
}
