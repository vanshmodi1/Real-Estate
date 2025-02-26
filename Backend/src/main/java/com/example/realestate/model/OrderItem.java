package com.example.realestate.model;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    private Order order;

    @ManyToOne
    private Property property;

    private String propertyType; // "Apartment", "Villa", etc.

    private String transactionType; // "Buy", "Rent", "Lease"

    private Integer price;

    private Integer discountedPrice;

    private String paymentStatus; // "Pending", "Completed"

    private String paymentMethod; // "UPI", "Credit Card"

    private Long userId;

    private String address; // Property address

    private LocalDateTime possessionDate; // When the buyer/renter gets possession

    private Long agentId; // Optional field if agents are involved
}
