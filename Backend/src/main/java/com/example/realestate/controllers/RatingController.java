package com.example.realestate.controllers;

import com.example.realestate.exception.PropertyException;
import com.example.realestate.exception.UserException;
import com.example.realestate.model.Rating;
import com.example.realestate.model.User;
import com.example.realestate.request.RatingRequest;
import com.example.realestate.service.RatingServices;
import com.example.realestate.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/ratings")
public class RatingController {

    @Autowired
    private RatingServices ratingService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Rating> addRating(@RequestBody RatingRequest ratingRequest, @RequestParam Long userId) throws UserException, PropertyException {
        // Fetch the user from the database
        Optional<User> userOptional = userService.findUserById(userId);
        if (userOptional.isEmpty()) {
            throw new UserException("User not found with ID: " + userId);
        }

        User user = userOptional.get();

        // Create and save the rating
        Rating rating = ratingService.createRating(ratingRequest, user);
        return ResponseEntity.ok(rating);
    }
}