package com.example.realestate.service;

import com.example.realestate.model.User;
import com.example.realestate.repository.UserRepository;
import com.example.realestate.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImplementation implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public Optional<User> findUserProfileByJwt(String jwt) {
    	String username = jwtUtil.getUsernameFromToken(jwt);
        return userRepository.findByEmail(username);

    }

    @Override
    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }
}
