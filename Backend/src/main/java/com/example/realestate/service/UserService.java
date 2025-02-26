package com.example.realestate.service;

import com.example.realestate.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User saveUser(User user);
    List<User> getAllUsers();
    Optional<User> findUserProfileByJwt(String jwt);
    Optional<User> findUserById(Long id);
}
