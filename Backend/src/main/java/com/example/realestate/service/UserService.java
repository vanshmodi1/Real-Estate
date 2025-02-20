package com.example.realestate.service;

import com.example.realestate.model.User;
import com.example.realestate.model.Role;
import com.example.realestate.repository.UserRepository;
import com.example.realestate.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;
    
    

    public User saveUser(User user) {
        return userRepository.save(user);
    }

}