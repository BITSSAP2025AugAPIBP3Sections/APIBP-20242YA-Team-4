package com.openEvent.event_service.Services;

import com.openEvent.event_service.DTO.AuthRequest;
import com.openEvent.event_service.Entities.User;
import com.openEvent.event_service.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;

    public String registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "User already exists!";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully!";
    }

    public String login(AuthRequest request) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return jwtService.generateToken(user.getEmail());
        }
        throw new RuntimeException("Invalid credentials");
    }

        public Optional<User> getUserByEmail(String email) {
            return userRepository.findByEmail(email);
        }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setEmail(updatedUser.getEmail());
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            user.setVerified(updatedUser.isVerified());
            // Add other fields as needed
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
