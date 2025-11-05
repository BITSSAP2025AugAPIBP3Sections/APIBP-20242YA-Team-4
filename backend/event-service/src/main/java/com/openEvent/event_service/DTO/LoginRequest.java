package com.openEvent.event_service.DTO;

public class LoginRequest {
    private String email;
    private String password;

    public String getUsername() {
        return this.email;
    }

    public String getPassword() {
        return this.password;
    }

}
