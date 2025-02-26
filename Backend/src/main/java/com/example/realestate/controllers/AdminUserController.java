package com.example.realestate.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.realestate.exception.UserException;
import com.example.realestate.model.User;
import com.example.realestate.service.UserService;

@RestController
@RequestMapping("/api/admin")
public class AdminUserController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String jwt) throws UserException {
        
        // Assuming JWT validation is handled elsewhere (e.g., in a security filter)
    	List<User> user = userService.getAllUsers();

        
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
