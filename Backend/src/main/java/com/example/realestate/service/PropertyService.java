package com.example.realestate.service;

import com.example.realestate.model.Property;
import com.example.realestate.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    // Add a new property
    public Property addProperty(Property property) {
        return propertyRepository.save(property);
    }

    // Get all properties
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    // Get properties by type (RENT, BUY, SALE)
    public List<Property> getPropertiesByType(String propertyType) {
        return propertyRepository.findByPropertyType(propertyType);
    }

    // Update property type
    public Property updatePropertyType(Long id, String newType) {
        Property property = propertyRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Property not found with ID: " + id));
        property.setPropertyType(newType);
        return propertyRepository.save(property);
    }

    // **DELETE Property by ID**
    public void deleteProperty(Long id) {
        if (!propertyRepository.existsById(id)) {
            throw new RuntimeException("Property with ID " + id + " not found.");
        }
        propertyRepository.deleteById(id);
    }
}
