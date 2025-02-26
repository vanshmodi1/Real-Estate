package com.example.realestate.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.realestate.security.JwtTokenProvider;
import com.example.realestate.exception.UserException;
import com.example.realestate.model.User;
import com.example.realestate.repository.UserRepository;
import com.example.realestate.request.LoginRequest;
import com.example.realestate.response.AuthResponse;
import com.example.realestate.service.CustomUserDetails;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetails customUserDetails;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder,
                          JwtTokenProvider jwtTokenProvider, CustomUserDetails customUserDetails) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.customUserDetails = customUserDetails;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@Valid @RequestBody User user) throws UserException {
        String email = user.getEmail();

        // Check if email is already used
        if (userRepository.findByEmail(email) != null) {
            throw new UserException("Email is already used with another account.");
        }

        // Create new user
        User createdUser = new User();
        createdUser.setEmail(email);
        createdUser.setFirstName(user.getFirstName());
        createdUser.setLastName(user.getLastName());
        createdUser.setPassword(passwordEncoder.encode(user.getPassword()));
        createdUser.setRole(user.getRole());

        userRepository.save(createdUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(email, user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        return new ResponseEntity<>(new AuthResponse(token, true), HttpStatus.OK);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);
        return new ResponseEntity<>(new AuthResponse(token, true), HttpStatus.OK);
    }

    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customUserDetails.loadUserByUsername(username);

        if (userDetails == null || !passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
