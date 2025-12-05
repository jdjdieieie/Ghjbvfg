package com.cts.service.impl;

import com.cts.entity.*;
import com.cts.repository.*;
import com.cts.service.AdminOrderService;
import com.cts.service.CommonOrderService;
import lombok.AllArgsConstructor;
import com.cts.client.AuthServiceClient;
import com.cts.dto.response.OrderPlacementResponseDTO;
import com.cts.dto.response.OrderResponseDTO;
import com.cts.enums.OrderStatus;
import com.cts.exception.UnauthorizedActionException;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class AdminOrderServiceImpl implements AdminOrderService {
    
    private final OrdersRepository orderRepository;
    private final CommonOrderService commonService;
    private final ModelMapper mapper;
    private AuthServiceClient authServiceClient;
   

	@Transactional
    public OrderPlacementResponseDTO updateOrderStatus(int orderId, OrderStatus newStatus) {
        com.cts.model.User admin = commonService.getCurrentAuthenticatedUser();
        
        if (!(admin instanceof com.cts.model.Admin)) {
            throw new UnauthorizedActionException("Only Admin can update order status.");
        }
        Order order = commonService.getOrderById(orderId);
        order.setOrderStatus(newStatus);
        Order savedOrder = orderRepository.save(order);
        return mapper.map(savedOrder, OrderPlacementResponseDTO.class);
    }
    


    @Transactional
    public OrderPlacementResponseDTO assignDeliveryPartner(int orderId, Long partnerId) {

        Order order = commonService.getOrderById(orderId);
        com.cts.model.User partner = commonService.getUserById(partnerId);
        if (!(partner instanceof com.cts.model.DeliveryPartner)) {
            throw new UnauthorizedActionException("User with ID " + partnerId + " is not a Delivery Partner.");
        }
        order.setDeliveryPartner(partnerId);
       
        Order savedOrder = orderRepository.save(order);
        authServiceClient.updateDeliveryPartnerAvailability(partnerId, false, true);
        return mapper.map(savedOrder, OrderPlacementResponseDTO.class);
    }
    


    public List<OrderResponseDTO> getAllOrdersWithDetails() {
        com.cts.model.User admin = commonService.getCurrentAuthenticatedUser();
        if (!(admin instanceof com.cts.model.Admin)) {
            throw new UnauthorizedActionException("Only Admin can view all orders.");
        }
        List<Order> orders = commonService.getAllOrders();
        return orders.stream()
            .map(this::mapToOrderResponseDto)
            .collect(Collectors.toList());
    }
    


    public Order getAnyOrder(int orderId) {
        com.cts.model.User admin = commonService.getCurrentAuthenticatedUser();
        if (!(admin instanceof com.cts.model.Admin)) {
            throw new UnauthorizedActionException("Only Admin can view any order.");
        }
        return commonService.getOrderById(orderId);
    }
    


    private OrderResponseDTO mapToOrderResponseDto(Order order) {
        return commonService.mapToOrderResponseDto(order);
    }

}
