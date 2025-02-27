package com.example.realestate.controllers;

import com.example.realestate.model.Property;
import com.example.realestate.model.User;
import com.example.realestate.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    // Add a new property with file uploads
    @PostMapping("/add")
    public ResponseEntity<Property> addProperty(
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
        @RequestParam("images") MultipartFile[] images,
        @RequestParam("sellerId") Long sellerId // Ensure this parameter is included
    ) {
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

        // Set the seller using the sellerId
        User seller = new User();
        seller.setId(sellerId);
        property.setSeller(seller);

        // Handle file uploads (e.g., save files to a directory or cloud storage)
        // You might want to add a method in PropertyService to handle file storage

        Property savedProperty = propertyService.addProperty(property);
        return ResponseEntity.ok(savedProperty);
    }

    // Get all properties
    @GetMapping("/all")
    public ResponseEntity<List<Property>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    // Get properties by type (RENT, BUY, SALE)
    @GetMapping("/type/{propertyType}")
    public ResponseEntity<List<Property>> getPropertiesByType(@PathVariable String propertyType) {
        return ResponseEntity.ok(propertyService.getPropertiesByType(propertyType));
    }

    // Update property type
    @PutMapping("/updateType/{id}")
    public ResponseEntity<Property> updatePropertyType(@PathVariable Long id, @RequestParam String newType) {
        Property updatedProperty = propertyService.updatePropertyType(id, newType);
        return ResponseEntity.ok(updatedProperty);
    }

    // Delete property by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok("Property with ID " + id + " deleted successfully.");
    }
}
