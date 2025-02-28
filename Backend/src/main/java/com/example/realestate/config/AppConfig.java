package com.example.realestate.config;

import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import com.example.realestate.security.JwtFilter; // Import your JwtFilter
import jakarta.servlet.http.HttpServletRequest;

@Configuration
public class AppConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Apply CORS config
            .csrf(csrf -> csrf.disable()) // Disable CSRF for APIs
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless authentication
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/auth/register", "/auth/login").permitAll() // Public authentication endpoints
                .requestMatchers("/api/properties/type/BUY").permitAll() // Allow public access to Buy properties
                .requestMatchers("/property/**").permitAll() // Allow access to property listings
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/properties/add/**", "/api/properties/update/**", "/api/properties/delete/**").authenticated() // Secure property CRUD
                .anyRequest().authenticated() // Secure all other endpoints
            )
            .addFilterBefore(jwtFilter, BasicAuthenticationFilter.class) // Register JwtFilter
            .httpBasic();

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        return request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // Allow frontend origin
            config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allow these methods
            config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type")); // Allow specific headers
            config.setAllowCredentials(true);
            config.setExposedHeaders(Arrays.asList("Authorization"));
            config.setMaxAge(3600L); // Cache CORS configuration
            return config;
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
