package com.cts.service.impl;

import com.cts.entity.*;
import com.cts.repository.*;
import com.cts.service.AdminOrderService;
import com.cts.service.CommonOrderService;
import com.cts.service.CustomerOrderService;

import lombok.AllArgsConstructor;

import com.cts.client.AuthServiceClient;
import com.cts.client.PromoCodeServiceClient;
import com.cts.dto.request.OrderItemDTO;
import com.cts.dto.request.OrderPlacementRequestDTO;
import com.cts.dto.promo.PromoCodeRedeemRequestDTO;
import com.cts.dto.promo.PromoCodeValidationRequestDTO;
import com.cts.dto.promo.PromoCodeValidationResponseDTO;
import com.cts.dto.response.OrderPlacementResponseDTO;
import com.cts.dto.response.OrderResponseDTO;
import com.cts.dto.response.UserResponseDTO;
import com.cts.enums.OrderStatus;
import com.cts.exception.FoodNotFoundException;
import com.cts.exception.FoodNotInStockException;
import com.cts.exception.NoPartnerAvaliableException;
import com.cts.exception.OrderCannotBeCancelException;
import com.cts.exception.PromoCodeIntegrationException;
import com.cts.exception.UnauthorizedActionException;
import com.cts.model.Customer;
import com.cts.model.User;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.FeignException;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class CustomerOrderServiceImpl implements CustomerOrderService{
    private static final double DELIVERY_CHARGE = 30.0;
    
    private final OrdersRepository orderRepository;
    private final FoodRepository foodRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderAddressRepository orderAddressRepository;
    private final CommonOrderService commonService;
    private final ModelMapper mapper;
    private final AdminOrderService adminOrderService;
    private final PromoCodeServiceClient promoCodeServiceClient;
    private final AuthServiceClient authServiceClient;
    private final ObjectMapper objectMapper;


	@Transactional
    public OrderPlacementResponseDTO placeOrder(OrderPlacementRequestDTO request) {
        List<OrderItemDTO> items = request.getItems();
        items.forEach(item -> {
            item.getFoodId();
                   Food food = foodRepository.findById(item.getFoodId())
                    .orElseThrow(() -> new FoodNotFoundException("Food not found with ID: " + item.getFoodId()));
                    if(food.isStatus()==false) {
                    	throw new FoodNotInStockException(food.getName() + " is currently Out Of Stock.");
                    }
        });
        User customer = commonService.getCurrentAuthenticatedUser();
        if (!(customer instanceof Customer)) {
            throw new UnauthorizedActionException("Only customers can place orders.");
        }
        Order order = new Order();
        order.setCustomer(customer.getId());
        order.setOrderDate(LocalDate.now());
        order.setOrderTime(LocalTime.now());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setDiscountAmount(0.0);
        order.setPromoCode(null);
        
        
        
        String otp = String.format("%06d", (int)(Math.random() * 1000000));
        order.setOtp(otp);
        
        double totalPrice = 0.0;
        int totalQty = 0;
        List<OrderItem> orderItems = new ArrayList<>();
        
        for (OrderItemDTO itemDto : request.getItems()) {
            Food food = foodRepository.findById(itemDto.getFoodId())
                    .orElseThrow(() -> new FoodNotFoundException("Food not found with ID: " + itemDto.getFoodId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setFood(food);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(food.getPrice());

            totalPrice += food.getPrice() * itemDto.getQuantity();
            totalQty += itemDto.getQuantity();
            orderItems.add(orderItem);
        }

        double orderSubtotal = totalPrice;
        double grandTotal = orderSubtotal + DELIVERY_CHARGE;
        order.setTotalPrice(grandTotal);
        order.setTotalQty(totalQty);
        Order savedOrder = orderRepository.save(order);
        final Order persistedOrder = savedOrder;
        
        OrderAddress orderAddress = new OrderAddress();
        orderAddress.setFirstName(request.getAddress().getFirstName());
        orderAddress.setLastName(request.getAddress().getLastName());
        orderAddress.setStreet(request.getAddress().getStreet());
        orderAddress.setCity(request.getAddress().getCity());
        orderAddress.setState(request.getAddress().getState());
        orderAddress.setPin(request.getAddress().getPin());
        orderAddress.setPhoneNo(request.getAddress().getPhoneNo());
        orderAddress.setOrder(savedOrder);
        orderAddressRepository.save(orderAddress);
        orderItems.forEach(item -> item.setOrder(persistedOrder));
        orderItemRepository.saveAll(orderItems);
        
        boolean promoApplied = false;
        if (StringUtils.hasText(request.getPromoCode())) {
            savedOrder = applyPromoCode(request.getPromoCode(), customer, orderSubtotal, savedOrder);
            promoApplied = StringUtils.hasText(savedOrder.getPromoCode());
        }

        

        ResponseEntity<List<UserResponseDTO>> response = authServiceClient.getActiveDeliveryPartners();
        List<UserResponseDTO> CanBeAssignedpartnersList = new ArrayList<>();
        
        for(UserResponseDTO partner : response.getBody()) {
			System.out.println("Active Delivery Partner: " + partner.getId() + " - " + partner.getName());
			if(partner.getAvailabilityStatus()==true) {
				CanBeAssignedpartnersList.add(partner);
			}
		}
        if(CanBeAssignedpartnersList.isEmpty()){
            throw new NoPartnerAvaliableException("No available delivery partners at the moment. Please try again later.");
        }
    
        adminOrderService.assignDeliveryPartner(savedOrder.getId(), CanBeAssignedpartnersList.get(0).getId());

        if (promoApplied) {
            finalizePromoUsage(savedOrder.getPromoCode(), customer, orderSubtotal, savedOrder);
        }

        return mapper.map(savedOrder, OrderPlacementResponseDTO.class);
    }
    


    @Transactional
    public OrderPlacementResponseDTO cancelOrder(int orderId) {
        com.cts.model.User customer = commonService.getCurrentAuthenticatedUser();
        Order order = commonService.getOrderById(orderId);
        if (order.getCustomer() != customer.getId()) {
            throw new UnauthorizedActionException("You can only cancel your own orders.");
        }
        if (order.getOrderStatus() == OrderStatus.DELIVERED || 
            order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new OrderCannotBeCancelException("Order status is " + 
                order.getOrderStatus().getDisplayName() + ". Cannot cancel.");
        }
        if(order.getOrderStatus() == OrderStatus.OUT) {
        	throw new OrderCannotBeCancelException("Order is out for delivery. Cannot cancel at this stage.");

        }
        if(order.getOrderStatus() == OrderStatus.PENDING) {
            order.setOrderStatus(OrderStatus.CANCELLED);
        }
        Order savedOrder = orderRepository.save(order);
        authServiceClient.updateDeliveryPartnerAvailability(order.getDeliveryPartner(), true, true);
        return mapper.map(savedOrder, OrderPlacementResponseDTO.class);
    }
 

    public List<OrderResponseDTO> getMyOrders() {
        com.cts.model.User customer = commonService.getCurrentAuthenticatedUser();
        List<Order> orders = commonService.getOrdersByCustomer(customer);
        return orders.stream()
            .map(order -> mapToOrderResponseDto(order))
            .collect(Collectors.toList());
    }
    



    public Order getMyOrder(int orderId) {
        com.cts.model.User customer = commonService.getCurrentAuthenticatedUser();
        Order order = commonService.getOrderById(orderId);
        if (order.getCustomer() != customer.getId()) {
            throw new UnauthorizedActionException("You can only view your own orders.");
        }
        return order;
    }
    


    private OrderResponseDTO mapToOrderResponseDto(Order order) {
        return commonService.mapToOrderResponseDto(order);
    }

    private Order applyPromoCode(String promoCode, User customer, double orderSubtotal, Order order) {
        try {
            PromoCodeValidationRequestDTO validationRequest = new PromoCodeValidationRequestDTO();
            validationRequest.setCode(StringUtils.trimWhitespace(promoCode));
            validationRequest.setCustomerId(customer.getId());
            validationRequest.setCustomerEmail(customer.getEmail());
            validationRequest.setOrderTotal(BigDecimal.valueOf(orderSubtotal));

            PromoCodeValidationResponseDTO promoResponse = promoCodeServiceClient.validatePromo(validationRequest);

            if (promoResponse == null || promoResponse.getFinalAmount() == null) {
                throw new PromoCodeIntegrationException("Promo code service returned an invalid response");
            }

            order.setPromoCode(promoResponse.getCode());
            order.setDiscountAmount(promoResponse.getDiscountAmount() != null
                ? promoResponse.getDiscountAmount().doubleValue()
                : 0.0);

            double discountedItemsTotal = promoResponse.getFinalAmount().doubleValue();
            double grandTotal = discountedItemsTotal + DELIVERY_CHARGE;
            order.setTotalPrice(grandTotal);
            return orderRepository.save(order);
        } catch (FeignException ex) {
            throw new PromoCodeIntegrationException(resolvePromoErrorMessage(ex));
        } catch (Exception ex) {
            throw new PromoCodeIntegrationException(ex.getMessage());
        }
    }

    private void finalizePromoUsage(String promoCode, User customer, double orderSubtotal, Order order) {
        try {
            PromoCodeRedeemRequestDTO redeemRequest = new PromoCodeRedeemRequestDTO();
            redeemRequest.setCode(StringUtils.trimWhitespace(promoCode));
            redeemRequest.setCustomerId(customer.getId());
            redeemRequest.setCustomerEmail(customer.getEmail());
            redeemRequest.setOrderId(order.getId());
            redeemRequest.setOrderTotal(BigDecimal.valueOf(orderSubtotal));
            promoCodeServiceClient.redeemPromo(redeemRequest);
        } catch (FeignException ex) {
            throw new PromoCodeIntegrationException(resolvePromoErrorMessage(ex));
        } catch (Exception ex) {
            throw new PromoCodeIntegrationException(ex.getMessage());
        }
    }

    private String resolvePromoErrorMessage(FeignException exception) {
        String defaultMessage = "Unable to apply promo code. Please try again.";
        String responseBody = exception.contentUTF8();
        if (!StringUtils.hasText(responseBody)) {
            return defaultMessage;
        }
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            if (root.has("errorMessage")) {
                return root.get("errorMessage").asText();
            }
            if (root.has("message")) {
                return root.get("message").asText();
            }
        } catch (Exception ignored) {
            return responseBody;
        }
        return responseBody;
    }
}
