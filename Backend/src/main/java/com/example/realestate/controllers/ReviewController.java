package com.example.realestate.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.realestate.exception.PropertyException;
import com.example.realestate.exception.UserException;
import com.example.realestate.model.Review;
import com.example.realestate.model.User;
import com.example.realestate.request.ReviewRequest;
import com.example.realestate.service.ReviewService;
import com.example.realestate.service.UserService;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    
    private ReviewService reviewService;
    private UserService userService;
    
    public ReviewController(ReviewService reviewService, UserService userService) {
        this.reviewService = reviewService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<Review> createReviewHandler(@RequestBody ReviewRequest req, 
                                                      @RequestHeader("Authorization") String jwt) 
                                                      throws UserException, PropertyException {
        User user = userService.findUserProfileByJwt(jwt);
        System.out.println("Property ID: " + req.getPropertyId() + " - Review: " + req.getReview());
        Review review = reviewService.createReview(req, user);
        System.out.println("Property review: " + req.getReview());
        return new ResponseEntity<>(review, HttpStatus.ACCEPTED);
    }
    
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Review>> getPropertyReviewsHandler(@PathVariable Long propertyId) {
        List<Review> reviews = reviewService.getAllReviews(propertyId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }
}
