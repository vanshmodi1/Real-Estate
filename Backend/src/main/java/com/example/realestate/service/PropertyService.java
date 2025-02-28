package com.example.realestate.service;

import com.example.realestate.model.Property;
import com.example.realestate.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    private static final String UPLOAD_DIR = "uploads/";
    private static final String BASE_URL = "http://localhost:9090/uploads/";

    public Property addProperty(Property property, MultipartFile[] images) {
        List<String> imageUrls = new ArrayList<>();

        if (images != null && images.length > 0) {
            ensureUploadDirectoryExists();
            imageUrls = saveImagesAndGetUrls(images);
        }

        property.setImageUrls(imageUrls);
        return propertyRepository.save(property);
    }

    private void ensureUploadDirectoryExists() {
        File uploadDirectory = new File(UPLOAD_DIR);
        if (!uploadDirectory.exists()) {
            boolean dirCreated = uploadDirectory.mkdirs();
            if (!dirCreated) {
                throw new RuntimeException("Failed to create upload directory: " + UPLOAD_DIR);
            }
        }
    }

    private List<String> saveImagesAndGetUrls(MultipartFile[] images) {
        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile image : images) {
            try {
                String fileName = generateUniqueFileName(image.getOriginalFilename());
                File destFile = new File(UPLOAD_DIR + fileName);
                saveImageToDisk(image, destFile);

                String imageUrl = BASE_URL + fileName;
                imageUrls.add(imageUrl);
            } catch (IOException e) {
                System.err.println("Failed to store file: " + image.getOriginalFilename());
                e.printStackTrace();
                throw new RuntimeException("Failed to store file: " + image.getOriginalFilename(), e);
            }
        }

        return imageUrls;
    }

    private String generateUniqueFileName(String originalFilename) {
        return UUID.randomUUID() + "_" + originalFilename;
    }

    private void saveImageToDisk(MultipartFile image, File destFile) throws IOException {
        System.out.println("Saving file to: " + destFile.getAbsolutePath());
        image.transferTo(destFile);
    }
}