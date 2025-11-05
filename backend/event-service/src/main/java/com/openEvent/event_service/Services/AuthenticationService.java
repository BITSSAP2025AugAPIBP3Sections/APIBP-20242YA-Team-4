package com.openEvent.event_service.Services;

import com.openEvent.event_service.DTO.AuthResponse;
import com.openEvent.event_service.DTO.LoginRequest;
import com.openEvent.event_service.DTO.RegisterRequest;
import com.openEvent.event_service.Entities.User;
import com.openEvent.event_service.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private  PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public void register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
    }


    public void register(String username, String password) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    public boolean validateUserCredentials(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return false;
        }

        // Compare raw password with encoded one
        return passwordEncoder.matches(password, user.getPassword());
    }

    public String generateToken(String username) {
        return jwtService.generateToken(username);
    }
}

