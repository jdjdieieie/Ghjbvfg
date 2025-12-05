package com.cts.service.impl;

import com.cts.entity.*;
import com.cts.repository.*;
import com.cts.service.CommonOrderService;
import com.cts.service.DeliveryPartnerOrderService;
import lombok.AllArgsConstructor;
import com.cts.client.AuthServiceClient;
import com.cts.dto.response.OrderPlacementResponseDTO;
import com.cts.dto.response.OrderResponseDTO;
import com.cts.enums.OrderStatus;
import com.cts.exception.InvalidOtpException;
import com.cts.exception.OrderCannotBeMarkException;
import com.cts.exception.UnauthorizedActionException;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class DeliveryPartnerOrderServiceImpl implements DeliveryPartnerOrderService {
    
    private final OrdersRepository orderRepository;
    private final CommonOrderService commonService;
    private final ModelMapper mapper;
    private AuthServiceClient authServiceClient;
    

	@Transactional
    public OrderPlacementResponseDTO markOrderCompleted(int orderId, String otp) {
        com.cts.model.User partner = commonService.getCurrentAuthenticatedUser();
        if (!(partner instanceof com.cts.model.DeliveryPartner)) {
            throw new UnauthorizedActionException("Only Delivery Partners can mark orders as completed.");
        }
        Order order = commonService.getOrderById(orderId);
        if (order.getDeliveryPartner() == 0 || 
            order.getDeliveryPartner() != partner.getId()) {
            throw new UnauthorizedActionException("You can only complete orders assigned to you.");
        }
        
        
        if (order.getOtp() == null || !order.getOtp().equals(otp)) {
            throw new InvalidOtpException("Invalid OTP. Order cannot be marked as delivered.");
        }
        
        if(order.getOrderStatus() != OrderStatus.OUT) {
            throw new OrderCannotBeMarkException("Order Cannot be marked delivered at this stage.");
        }
        order.setOrderStatus(OrderStatus.DELIVERED);
        Order savedOrder = orderRepository.save(order);
        authServiceClient.updateDeliveryPartnerAvailability(order.getDeliveryPartner(), true, true);
        authServiceClient.updateTotalOrders(order.getDeliveryPartner());
        authServiceClient.updateTotalOrders(order.getCustomer());

          
        return mapper.map(savedOrder, OrderPlacementResponseDTO.class);
    }
    
    public OrderPlacementResponseDTO markOrderOutForDelivery(int orderId) {
        com.cts.model.User partner = commonService.getCurrentAuthenticatedUser();
        if (!(partner instanceof com.cts.model.DeliveryPartner)) {
            throw new UnauthorizedActionException("Only Delivery Partners can mark orders as out for delivery.");
        }
        Order order = commonService.getOrderById(orderId);
        if (order.getDeliveryPartner() == 0 || 
            order.getDeliveryPartner() != partner.getId()) {
            throw new UnauthorizedActionException("You can only update orders assigned to you.");
        }
        if(order.getOrderStatus() != OrderStatus.PENDING) {
            throw new OrderCannotBeMarkException("Order Cannot be marked out for delivery at this stage.");
        }
        order.setOrderStatus(OrderStatus.OUT);
        Order savedOrder = orderRepository.save(order);
          
        return mapper.map(savedOrder, OrderPlacementResponseDTO.class);
    }

    public List<OrderResponseDTO> getMyAssignedOrders() {
        com.cts.model.User partner = commonService.getCurrentAuthenticatedUser();
        if (!(partner instanceof com.cts.model.DeliveryPartner)) {
            throw new UnauthorizedActionException("Only Delivery Partners can view assigned orders.");
        }
        List<Order> orders = commonService.getOrdersByDeliveryPartner(partner);
        return orders.stream()
            .map(this::mapToOrderResponseDto)
            .collect(Collectors.toList());
    }
    



    public Order getMyAssignedOrder(int orderId) {
        com.cts.model.User partner = commonService.getCurrentAuthenticatedUser();
        Order order = commonService.getOrderById(orderId);
        if (order.getDeliveryPartner() == 0 || 
            order.getDeliveryPartner() != partner.getId()) {
            throw new UnauthorizedActionException("You can only view orders assigned to you.");
        }
        return order;
    }
    


    private OrderResponseDTO mapToOrderResponseDto(Order order) {
        return commonService.mapToOrderResponseDto(order);
    }
}
