package com.example.realestate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.realestate.repository")
@EntityScan(basePackages = "com.example.realestate.model")
public class RealestateBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(RealestateBackendApplication.class, args);
    }
}
