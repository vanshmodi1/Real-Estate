package com.example.realestate.dto;

public class RatingRequest {

    private Long propertyId;
    private Long userId;
    private double ratingValue;

    // Getters and Setters
    public Long getPropertyId() { return propertyId; }

    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public Long getUserId() { return userId; }

    public void setUserId(Long userId) { this.userId = userId; }

    public double getRatingValue() { return ratingValue; }

    public void setRatingValue(double ratingValue) { this.ratingValue = ratingValue; }
}
