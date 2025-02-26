package com.example.realestate.service;

import java.util.List;

import com.example.realestate.exception.PropertyException;
import com.example.realestate.model.Rating;
import com.example.realestate.model.User;
import com.example.realestate.request.RatingRequest;

public interface RatingServices {
    
    public Rating createRating(RatingRequest req, User user) throws PropertyException;
    
    public List<Rating> getPropertyRatings(Long propertyId);
}
