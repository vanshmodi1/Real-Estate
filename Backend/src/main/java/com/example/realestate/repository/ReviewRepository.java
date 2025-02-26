package com.example.realestate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.realestate.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT r FROM Review r WHERE r.property.id = :propertyId")
    List<Review> getAllPropertyReviews(@Param("propertyId") Long propertyId);
}
