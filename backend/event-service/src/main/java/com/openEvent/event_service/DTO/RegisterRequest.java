package com.openEvent.event_service.DTO;

public class RegisterRequest {
    private String fullName;
    protected String email;
    protected String password;

    public String getEmail() {
        return this.email;
    }

    public String getPassword() {
        return this.password;
    }

}
