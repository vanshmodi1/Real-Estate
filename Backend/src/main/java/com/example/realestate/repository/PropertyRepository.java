package com.example.realestate.repository;

import com.example.realestate.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findBySellerId(Long sellerId);
    List<Property> findByType(String type);
}
