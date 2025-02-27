package com.example.realestate.controllers;

import com.example.realestate.model.Property;
import com.example.realestate.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    // Add a new property
    @PostMapping("/add")
    public ResponseEntity<Property> addProperty(@RequestBody Property property) {
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

    // **DELETE Property by ID**
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok("Property with ID " + id + " deleted successfully.");
    }
}
