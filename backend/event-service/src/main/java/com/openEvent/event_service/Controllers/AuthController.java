package com.openEvent.event_service.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.openEvent.event_service.Services.AuthenticationService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationService authService;

    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password) {
        if (authService.validateUserCredentials(username, password)) {
            return authService.generateToken(username);
        } else {
            return "Invalid credentials!";
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestParam String username, @RequestParam String password) {
        authService.register(username, password);
        return ResponseEntity.ok("User registered successfully!");
    }

}
