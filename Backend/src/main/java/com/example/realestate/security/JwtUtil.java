package com.example.realestate.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username) // Set the subject (e.g., username or email)
                .setIssuedAt(new Date()) // Set the issue time
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration)) // Set the expiration time
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Sign the token
                .compact(); // Build the token
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // Set the signing key
                .build()
                .parseClaimsJws(token) // Parse the token
                .getBody()
                .getSubject(); // Get the subject (e.g., username or email)
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true; // Token is valid
        } catch (JwtException | IllegalArgumentException e) {
            return false; // Token is invalid
        }
    }
}