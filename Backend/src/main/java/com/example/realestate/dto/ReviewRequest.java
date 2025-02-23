package com.example.realestate.dto;

public class ReviewRequest {

    private Long propertyId;
    private Long userId;
    private String reviewText;

    // Getters and Setters
    public Long getPropertyId() { return propertyId; }

    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public Long getUserId() { return userId; }

    public void setUserId(Long userId) { this.userId = userId; }

    public String getReviewText() { return reviewText; }

    public void setReviewText(String reviewText) { this.reviewText = reviewText; }
}
