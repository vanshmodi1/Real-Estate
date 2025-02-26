package com.example.realestate.service;

import com.example.realestate.exception.OrderException;
import com.example.realestate.model.Address;
import com.example.realestate.model.Order;
import com.example.realestate.model.User;
import com.example.realestate.repository.AddressRepository;
import com.example.realestate.repository.OrderRepository;
import com.example.realestate.repository.UserRepository;
import com.example.realestate.user.domain.OrderStatus;
import com.example.realestate.user.domain.PaymentStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderServiceImplementation implements OrderService {

    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public OrderServiceImplementation(OrderRepository orderRepository,
                                      AddressRepository addressRepository, 
                                      UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Order createOrder(User user, Address shippingAddress) {
        // Save shipping address
        shippingAddress.setUser(user);
        Address savedAddress = addressRepository.save(shippingAddress);
        user.getAddresses().add(savedAddress);
        userRepository.save(user);

        // Create new order
        Order createdOrder = new Order();
        createdOrder.setUser(user);
        createdOrder.setPropertyAddress(savedAddress);
        createdOrder.setOrderDate(LocalDate.now());
        createdOrder.setOrderStatus(OrderStatus.PENDING);
        createdOrder.setCreatedAt(LocalDateTime.now());

        // Set payment details
        createdOrder.getPaymentDetails().setStatus(PaymentStatus.PENDING);

        // Save order
        return orderRepository.save(createdOrder);
    }

    @Override
    public Order placedOrder(Long orderId) throws OrderException {
        Order order = findOrderById(orderId);
        order.setOrderStatus(OrderStatus.PLACED);
        order.getPaymentDetails().setStatus(PaymentStatus.COMPLETED);
        return orderRepository.save(order);
    }

    @Override
    public Order confirmedOrder(Long orderId) throws OrderException {
        Order order = findOrderById(orderId);
        order.setOrderStatus(OrderStatus.CONFIRMED);
        return orderRepository.save(order);
    }

    @Override
    public Order canceledOrder(Long orderId) throws OrderException {
        Order order = findOrderById(orderId);
        order.setOrderStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    @Override
    public Order findOrderById(Long orderId) throws OrderException {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException("Order not found with ID: " + orderId));
    }

    @Override
    public List<Order> usersOrderHistory(Long userId) {
        return orderRepository.getUsersOrders(userId);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public void deleteOrder(Long orderId) throws OrderException {
        Order order = findOrderById(orderId);
        orderRepository.deleteById(orderId);
    }
}
