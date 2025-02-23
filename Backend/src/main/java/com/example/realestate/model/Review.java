package com.example.realestate.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String reviewText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDateTime createdAt;

    // Getters and Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getReviewText() { return reviewText; }

    public void setReviewText(String reviewText) { this.reviewText = reviewText; }

    public Property getProperty() { return property; }

    public void setProperty(Property property) { this.property = property; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
