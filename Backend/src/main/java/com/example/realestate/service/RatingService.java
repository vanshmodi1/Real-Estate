package com.example.realestate.service;

import com.example.realestate.model.Rating;
import com.example.realestate.model.Property;
import com.example.realestate.model.User;
import com.example.realestate.repository.RatingRepository;
import com.example.realestate.repository.PropertyRepository;
import com.example.realestate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    public Rating addRating(Long propertyId, Long userId, double ratingValue) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Rating rating = new Rating();
        rating.setProperty(property);
        rating.setUser(user);
        rating.setRatingValue(ratingValue);
        rating.setCreatedAt(LocalDateTime.now());

        return ratingRepository.save(rating);
    }

    public List<Rating> getRatingsByProperty(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        return ratingRepository.findByProperty(property);
    }

    public void deleteRating(Long ratingId) {
        ratingRepository.deleteById(ratingId);
    }
}
