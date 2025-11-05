package com.openEvent.event_service.DTO;

public class AuthResponse {
    private String token;
    private String message;

    public AuthResponse(String token, String loginSuccessful) {
        this.token = token;
        this.message = loginSuccessful;
    }

}
