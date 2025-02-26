package com.example.realestate.service;

import com.example.realestate.exception.OrderException;
import com.example.realestate.model.Address;
import com.example.realestate.model.Order;
import com.example.realestate.model.User;

import java.util.List;

public interface OrderService {
    Order createOrder(User user, Address address);

    Order placedOrder(Long orderId) throws OrderException;

    Order confirmedOrder(Long orderId) throws OrderException;

    Order canceledOrder(Long orderId) throws OrderException;

    Order findOrderById(Long orderId) throws OrderException;

    List<Order> usersOrderHistory(Long userId);

    List<Order> getAllOrders();

    void deleteOrder(Long orderId) throws OrderException;
}
