package com.example.realestate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.realestate.model.Rating;

public interface RatingRepository extends JpaRepository<Rating, Long> {
	
	@Query("SELECT r FROM Rating r WHERE r.property.id = :propertyId")
	List<Rating> getAllPropertyRatings(@Param("propertyId") Long propertyId);
}
