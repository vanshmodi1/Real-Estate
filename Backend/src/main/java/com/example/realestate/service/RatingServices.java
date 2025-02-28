package com.example.realestate.service;

import com.example.realestate.exception.PropertyException;
import com.example.realestate.model.Rating;
import com.example.realestate.model.User;
import com.example.realestate.request.RatingRequest;
import java.util.List;

public interface RatingServices {
    Rating createRating(RatingRequest req, User user) throws PropertyException;
    List<Rating> getPropertyRatings(Long propertyId);
}