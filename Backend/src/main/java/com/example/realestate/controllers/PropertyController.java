package com.example.realestate.controllers;

import com.example.realestate.exception.PropertyException;
import com.example.realestate.model.Property;
import com.example.realestate.user.domain.PropertyStatus;
import com.example.realestate.model.User;
import com.example.realestate.service.PropertyService;
import com.example.realestate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
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

    // Add a new property
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

    // Get all properties
    @GetMapping("/all")
    public ResponseEntity<List<Property>> getAllProperties() {
        logger.info("Fetching all properties");
        List<Property> properties = propertyService.getAllProperties();
        return ResponseEntity.ok(properties);
    }

    // Get property by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPropertyById(@PathVariable Long id) {
        logger.info("Fetching property with ID: " + id);
        Optional<Property> property = propertyService.getPropertyById(id);

        if (property.isPresent()) {
            return ResponseEntity.ok(property.get());
        } else {
            return ResponseEntity.badRequest().body("Property not found with ID: " + id);
        }
    }

    // Get properties by type (BUY/RENT/SELL)
    @GetMapping("/type/{type}")
    public ResponseEntity<?> getPropertiesByType(@PathVariable String type) {
        logger.info("Fetching properties for type: " + type);
        try {
            List<Property> properties = propertyService.getPropertiesByType(type);
            logger.info("Fetched " + properties.size() + " properties");
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            logger.severe("Error fetching properties: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Error fetching properties.");
        }
    }

    // Update an existing property
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProperty(@PathVariable Long id, @RequestBody Property updatedProperty) {
        logger.info("Updating property with ID: " + id);
        Optional<Property> propertyOptional = propertyService.getPropertyById(id);

        if (propertyOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Property not found with ID: " + id);
        }

        Property property = propertyOptional.get();
        property.setPropertyTitle(updatedProperty.getPropertyTitle());
        property.setDescription(updatedProperty.getDescription());
        property.setPrice(updatedProperty.getPrice());
        property.setDiscountedPrice(updatedProperty.getDiscountedPrice());
        property.setDiscountPercent(updatedProperty.getDiscountPercent());
        property.setLocation(updatedProperty.getLocation());
        property.setPropertyCategory(updatedProperty.getPropertyCategory());
        property.setNumberOfBedrooms(updatedProperty.getNumberOfBedrooms());
        property.setNumberOfBathrooms(updatedProperty.getNumberOfBathrooms());
        property.setSquareFeet(updatedProperty.getSquareFeet());
        property.setPropertyType(updatedProperty.getPropertyType());

        Property savedProperty = propertyService.updateProperty(property);
        return ResponseEntity.ok(savedProperty);
    }

    // Delete property by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProperty(@PathVariable Long id) {
        logger.info("Deleting property with ID: " + id);
        boolean isDeleted = propertyService.deleteProperty(id);

        if (isDeleted) {
            return ResponseEntity.ok("Property deleted successfully");
        } else {
            return ResponseEntity.badRequest().body("Property not found or could not be deleted");
        }
    }

    // ✅ New endpoint to update property status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updatePropertyStatus(@PathVariable Long id, @RequestParam PropertyStatus status) {
        logger.info("Updating status for property with ID: " + id);
        try {
            Property updatedProperty = propertyService.updatePropertyStatus(id, status);
            return ResponseEntity.ok(updatedProperty);
        } catch (PropertyException e) {
            logger.severe("Error updating property status: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}