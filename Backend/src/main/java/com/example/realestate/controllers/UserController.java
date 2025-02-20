package com.example.realestate.controllers;

import com.example.realestate.model.User;
import com.example.realestate.repository.UserRepository;
import com.example.realestate.security.JwtFilter;
import com.example.realestate.security.JwtUtil;
import com.example.realestate.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
	
	@Autowired
	private UserRepository userRepository;

    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtFilter filter;
    
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
	public User saveRegister(@RequestBody User user) {
		return userService.saveUser(user);
	}
    
    
    
    @PostMapping("/login")
	public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginData) {

	    String email = loginData.get("email");
	    String password = loginData.get("password");
	    Optional<User> user = userRepository.findByEmail(email);

	    if (user.isPresent() && user.get().getPassword().equals(password)) {
	        Map<String, String> response = new HashMap<>();
	        String token = jwtUtil.generateToken(email);

	        response.put("login", "success");
	        response.put("token", token);
	        response.put("role", user.get().getRole());
	        response.put("username", user.get().getName()); 
	        response.put("id", String.valueOf(user.get().getId())); 

	        return ResponseEntity.ok(response);
	    } else {
	        Map<String, String> response1 = new HashMap<>();
	        response1.put("login", "fail");
	        return ResponseEntity.status(401).body(response1);
	    }
	}
}