package com.example.realestate.controllers;

import com.example.realestate.dto.RatingRequest;
import com.example.realestate.model.Rating;
import com.example.realestate.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @PostMapping
    public ResponseEntity<Rating> addRating(@RequestBody RatingRequest ratingRequest) {
        Rating rating = ratingService.addRating(
                ratingRequest.getPropertyId(),
                ratingRequest.getUserId(),
                ratingRequest.getRatingValue()
        );
        return ResponseEntity.ok(rating);
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Rating>> getRatingsByProperty(@PathVariable Long propertyId) {
        List<Rating> ratings = ratingService.getRatingsByProperty(propertyId);
        return ResponseEntity.ok(ratings);
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<String> deleteRating(@PathVariable Long ratingId) {
        ratingService.deleteRating(ratingId);
        return ResponseEntity.ok("Rating deleted successfully");
    }
}
