package com.example.realestate.service;

import com.example.realestate.model.Property;
import com.example.realestate.model.User;
import com.example.realestate.repository.PropertyRepository;
import com.example.realestate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    public Property addProperty(Long sellerId, Property property) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        if (!seller.getRole().equals("SELLER")) {
            throw new RuntimeException("User is not a seller");
        }

        property.setSeller(seller);
        return propertyRepository.save(property);
    }

    public List<Property> getPropertiesBySeller(Long sellerId) {
        return propertyRepository.findBySellerId(sellerId);
    }

    public Property getPropertyById(Long propertyId) {
        return propertyRepository.findById(propertyId).orElse(null);
    }

    public Property updateProperty(Long propertyId, Property propertyDetails) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        property.setDescription(propertyDetails.getDescription());
        property.setImage(propertyDetails.getImage());
        property.setLocation(propertyDetails.getLocation());
        property.setPrice(propertyDetails.getPrice());
        property.setPropertyName(propertyDetails.getPropertyName());
        property.setType(propertyDetails.getType());

        return propertyRepository.save(property);
    }

    public void deleteProperty(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        propertyRepository.delete(property);
    }

    public List<Property> getPropertiesByType(String type) {
        return propertyRepository.findByType(type);
    }
}
