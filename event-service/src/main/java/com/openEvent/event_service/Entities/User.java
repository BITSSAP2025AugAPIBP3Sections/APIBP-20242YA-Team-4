package com.openEvent.event_service.Entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean verified;

    // timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public void setPassword(String encode) {
        this.password = encode;
    }

    public void setVerified(boolean b) {
        this.verified = b;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getEmail() {
        return this.email;
    }

    public String getPassword() {
        return this.password;
    }

    // Getters, setters, constructors
}
