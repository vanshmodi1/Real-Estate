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
import jakarta.servlet.http.HttpServletRequest;

import com.example.realestate.security.JwtFilter; // Import your JwtFilter

@Configuration
public class AppConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/register", "/login").permitAll() // Allow public access to these endpoints
                .requestMatchers("/property/add/**", "/property/update/**", "/property/delete/**").authenticated() // Secure property management endpoints
                .requestMatchers("/property/**").permitAll() // Allow access to other property-related endpoints
                .anyRequest().authenticated() // Secure all other endpoints
            )
            .addFilterBefore(jwtFilter, BasicAuthenticationFilter.class) // Register JwtFilter
            .csrf().disable()
            .cors().configurationSource(new CorsConfigurationSource() {
                @Override
                public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                    CorsConfiguration cfg = new CorsConfiguration();

                    // Restrict to specific origins in production
                    cfg.setAllowedOrigins(Arrays.asList("http://localhost:5173"));

                    // Allow necessary HTTP methods & headers
                    cfg.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    cfg.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

                    cfg.setAllowCredentials(true);
                    cfg.setExposedHeaders(Arrays.asList("Authorization"));
                    cfg.setMaxAge(3600L);
                    return cfg;
                }
            })
            .and()
            .httpBasic();

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
