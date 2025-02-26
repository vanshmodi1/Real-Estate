package com.example.realestate.service;

import com.example.realestate.exception.ResourceNotFoundException;
import com.example.realestate.model.Property;
import com.example.realestate.model.User;
import com.example.realestate.repository.PropertyRepository;
import com.example.realestate.repository.UserRepository;
import com.example.realestate.request.CreatePropertyRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    public Property createProperty(CreatePropertyRequest request) {
        User seller = userRepository.findById(request.getSellerId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

        if (!"SELLER".equals(seller.getRole())) {
            throw new RuntimeException("User is not a seller");
        }

        Property property = new Property();
        property.setSeller(seller);
        property.setPropertyTitle(request.getPropertyTitle());
        property.setDescription(request.getDescription());
        property.setLocation(request.getLocation());
        property.setPrice(request.getPrice());
        property.setDiscountedPrice(request.getDiscountedPrice());
        property.setDiscountPercent(request.getDiscountPercent());
        property.setPropertyType(request.getPropertyType());
        property.setImageUrl(request.getImageUrl());
        property.setPropertyCategory(request.getPropertyCategory());
        property.setNumberOfBedrooms(request.getNumberOfBedrooms());
        property.setNumberOfBathrooms(request.getNumberOfBathrooms());
        property.setSquareFeet(request.getSquareFeet());

        return propertyRepository.save(property);
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public Property getPropertyById(Long propertyId) {
        return propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
    }

    public Property updateProperty(Long propertyId, Property updatedProperty) {
        Property existingProperty = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        existingProperty.setLocation(updatedProperty.getLocation());
        existingProperty.setPrice(updatedProperty.getPrice());
        existingProperty.setType(updatedProperty.getType());
        existingProperty.setDescription(updatedProperty.getDescription());

        return propertyRepository.save(existingProperty);
    }

    public void deleteProperty(Long propertyId) {
        Property existingProperty = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        propertyRepository.delete(existingProperty);
    }
}
