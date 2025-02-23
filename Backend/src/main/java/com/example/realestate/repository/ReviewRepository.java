package com.example.realestate.repository;

import com.example.realestate.model.Review;
import com.example.realestate.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProperty(Property property);
}
