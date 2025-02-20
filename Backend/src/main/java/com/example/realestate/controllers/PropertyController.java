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
        Property savedProperty = propertyService.addProperty(sellerId, property);
        return ResponseEntity.ok(savedProperty);
    }
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Property>> getSellerProperties(@PathVariable Long sellerId) {
        List<Property> properties = propertyService.getPropertiesBySeller(sellerId);
        return ResponseEntity.ok(properties);
    }
    @GetMapping("/{propertyId}")
    public ResponseEntity<Property> getPropertyById1(@PathVariable Long propertyId) {
        Property property = propertyService.getPropertyById(propertyId);
        return ResponseEntity.ok(property);
    }
    @PutMapping("/update/{propertyId}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long propertyId, @RequestBody Property property) {
        Property updatedProperty = propertyService.updateProperty(propertyId, property);
        return ResponseEntity.ok(updatedProperty);
    }
    @DeleteMapping("/delete/{propertyId}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long propertyId) {
        propertyService.deleteProperty(propertyId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Property>> getPropertiesByType(@PathVariable String type) {
        List<Property> properties = propertyService.getPropertiesByType(type);
        return ResponseEntity.ok(properties);
    }
    
   
}
