package com.example.realestate.service;

import com.example.realestate.model.OrderItem;
import java.util.List;

public interface OrderItemService {
    OrderItem createOrderItem(OrderItem orderItem);
    List<OrderItem> getOrderItemsByOrderId(Long orderId);
}
