package com.example.realestate.response;

public class AuthResponse {
    
    private String token;  // More intuitive name for JWT
    private boolean success;

    public AuthResponse() {
        // Default constructor
    }

    public AuthResponse(String token, boolean success) {
        this.token = token;
        this.success = success;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
