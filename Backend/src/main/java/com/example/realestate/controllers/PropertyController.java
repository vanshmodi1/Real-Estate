package com.example.realestate.controllers;

import com.example.realestate.model.Property;
import com.example.realestate.model.User;
import com.example.realestate.service.PropertyService;
import com.example.realestate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = Logger.getLogger(PropertyController.class.getName());

    @PostMapping(value = "/add", consumes = {"multipart/form-data"})
    public ResponseEntity<?> addProperty(
        @RequestParam("propertyTitle") String propertyTitle,
        @RequestParam("description") String description,
        @RequestParam("price") Double price,
        @RequestParam("discountedPrice") Double discountedPrice,
        @RequestParam("discountPercent") Double discountPercent,
        @RequestParam("location") String location,
        @RequestParam("propertyCategory") String propertyCategory,
        @RequestParam("numberOfBedrooms") Integer numberOfBedrooms,
        @RequestParam("numberOfBathrooms") Integer numberOfBathrooms,
        @RequestParam("squareFeet") Double squareFeet,
        @RequestParam("propertyType") String propertyType,
        @RequestParam("sellerId") Long sellerId,
        @RequestPart(value = "images", required = false) MultipartFile[] images
    ) {
        logger.info("Received request to add a new property");

        Optional<User> sellerOptional = userRepository.findById(sellerId);
        if (sellerOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Seller with ID " + sellerId + " not found");
        }
        User seller = sellerOptional.get();

        Property property = new Property();
        property.setPropertyTitle(propertyTitle);
        property.setDescription(description);
        property.setPrice(price);
        property.setDiscountedPrice(discountedPrice);
        property.setDiscountPercent(discountPercent);
        property.setLocation(location);
        property.setPropertyCategory(propertyCategory);
        property.setNumberOfBedrooms(numberOfBedrooms);
        property.setNumberOfBathrooms(numberOfBathrooms);
        property.setSquareFeet(squareFeet);
        property.setPropertyType(propertyType);
        property.setSeller(seller);

        Property savedProperty = propertyService.addProperty(property, images);

        logger.info("Property added successfully with ID: " + savedProperty.getId());
        return ResponseEntity.ok(savedProperty);
    }
}
