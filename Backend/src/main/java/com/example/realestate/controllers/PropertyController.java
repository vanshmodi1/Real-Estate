package com.example.realestate.controllers;

import com.example.realestate.model.Property;
import com.example.realestate.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/property")
@CrossOrigin(origins = "http://localhost:5173")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @PostMapping("/add/{sellerId}")
    public ResponseEntity<Property> addProperty(@PathVariable Long sellerId, @RequestBody Property property) {
        try {
            Property savedProperty = propertyService.addProperty(sellerId, property);
            return ResponseEntity.ok(savedProperty);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Property>> getSellerProperties(@PathVariable Long sellerId) {
        List<Property> properties = propertyService.getPropertiesBySeller(sellerId);
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/{propertyId}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long propertyId) {
        Property property = propertyService.getPropertyById(propertyId);
        if (property != null) {
            return ResponseEntity.ok(property);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update/{propertyId}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long propertyId, @RequestBody Property property) {
        try {
            Property updatedProperty = propertyService.updateProperty(propertyId, property);
            return ResponseEntity.ok(updatedProperty);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/delete/{propertyId}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long propertyId) {
        try {
            propertyService.deleteProperty(propertyId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Property>> getPropertiesByType(@PathVariable String type) {
        List<Property> properties = propertyService.getPropertiesByType(type);
        return ResponseEntity.ok(properties);
    }
}
