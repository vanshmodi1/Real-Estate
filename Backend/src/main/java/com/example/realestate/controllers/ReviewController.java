package com.example.realestate.controllers;

import com.example.realestate.dto.ReviewRequest;
import com.example.realestate.model.Review;
import com.example.realestate.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody ReviewRequest reviewRequest) {
        Review review = reviewService.addReview(
                reviewRequest.getPropertyId(),
                reviewRequest.getUserId(),
                reviewRequest.getReviewText()
        );
        return ResponseEntity.ok(review);
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Review>> getReviewsByProperty(@PathVariable Long propertyId) {
        List<Review> reviews = reviewService.getReviewsByProperty(propertyId);
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok("Review deleted successfully");
    }
}
