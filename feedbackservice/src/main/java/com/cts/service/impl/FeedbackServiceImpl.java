package com.cts.service.impl;

import java.time.LocalDate;
import java.util.List;

import com.cts.client.FoodServiceClient;
import com.cts.client.OrderServiceClient;
import com.cts.client.UserServiceClient;
import com.cts.dto.request.FoodFeedbackRequestDTO;
import com.cts.dto.response.FoodFeedbackResponseDTO;
import com.cts.entity.Feedback;
import com.cts.enums.OrderStatus;
import com.cts.exception.FeedbackAlreadyProvidedException;
import com.cts.exception.FoodNotFoundException;
import com.cts.exception.OrderNotFoundException;
import com.cts.exception.UnauthorizedActionException;
import com.cts.exception.UserNotFoundException;
import com.cts.model.Food;
import com.cts.model.Order;
import com.cts.model.User;
import com.cts.repository.FeedbackRepository;
import com.cts.service.FeedbackService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {
    
    private ModelMapper modelMapper;
    private FeedbackRepository feedbackRepo;
    private UserServiceClient userServiceClient;
    private FoodServiceClient foodServiceClient;
    private OrderServiceClient orderServiceClient;

    public FoodFeedbackResponseDTO submitFoodFeedback(
            FoodFeedbackRequestDTO foodFeedbackRequestDTO,
            Integer foodId) {
    	
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new UnauthorizedActionException("User authentication is required");
        }
        String email = authentication.getName();
        User user;
        try {
            user = userServiceClient.getUserByEmail(email);
        } catch (Exception e) {
            throw new com.cts.exception.FeignClientException("Failed to fetch user details: " + e.getMessage(), e);
        }
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        long customerId = user.getId();
        int orderId = foodFeedbackRequestDTO.getOrderId();
        
        Order order;
        try {
            order = orderServiceClient.getOrderById(orderId);
        } catch (Exception e) {
            throw new com.cts.exception.FeignClientException("Failed to fetch order details: " + e.getMessage(), e);
        }
        if (order == null) {
            throw new OrderNotFoundException("Order not found with ID: " + orderId);
        }
        
        if (order.getCustomer() != customerId) {
            throw new UnauthorizedActionException("You can only provide feedback for your own orders");
        }
        
        if (order.getOrderStatus() != OrderStatus.DELIVERED) {
            throw new UnauthorizedActionException("You can only provide feedback for delivered orders");
        }
        
        boolean foodExistsInOrder = order.getOrderItems().stream()
                .anyMatch(orderItem -> orderItem.getFood().getId() == foodId);
        
        if (!foodExistsInOrder) {
            throw new FoodNotFoundException("Food item not found in this order");
        }
        
        if (feedbackRepo.existsByOrderIdAndCustomerAndFoodId(orderId, customerId, foodId)) {
            throw new FeedbackAlreadyProvidedException("Feedback already provided for this food in this order");
        }

        Feedback feedback = new Feedback();
        feedback.setDateOfFeedback(LocalDate.now());
        feedback.setCustomer(customerId);
        feedback.setOrderId(orderId);
        feedback.setFoodId(foodId);
        feedback.setFoodRating(foodFeedbackRequestDTO.getFoodRating());
       
        Feedback savedFeedback = feedbackRepo.save(feedback);
        
        // Update average rating in Food service via Feign client
        Float avgRatingFloat = feedbackRepo.findAverageRatingByFoodId(foodId);
        if (avgRatingFloat != null) {
            try {
                foodServiceClient.updateFoodRating(foodId, avgRatingFloat);
            } catch (Exception e) {
                // Log the error but don't fail the feedback submission
                System.err.println("Warning: Failed to update food rating: " + e.getMessage());
            }
        }

        return convertToFoodFeedbackDTO(savedFeedback);
    }

    public FoodFeedbackResponseDTO convertToFoodFeedbackDTO(Feedback feedback) {
        FoodFeedbackResponseDTO dto = modelMapper.map(feedback, FoodFeedbackResponseDTO.class);
        if (feedback.getFoodId() != null) {
            dto.setFoodId(feedback.getFoodId());
        } else {
            dto.setFoodId(null);
        }
        if (feedback.getOrderId() != null) {
            dto.setOrderId(feedback.getOrderId());
        } else {
            dto.setOrderId(null);
        }
        return dto;
    }

   public List<FoodFeedbackResponseDTO> getFeedbackByFoodId(Integer foodId) {
        List<Feedback> feedbacks = feedbackRepo.findByFoodId(foodId);
        if (feedbacks.isEmpty()) {
           throw new FoodNotFoundException("No feedback found for Food ID: " + foodId);
       }
        return feedbacks.stream()
                .map(this::convertToFoodFeedbackDTO)
                .collect(java.util.stream.Collectors.toList());
   }

 public List<Order> getCompletedOrdersForFeedback() {
     Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
     if (authentication == null || authentication.getName() == null) {
         throw new UnauthorizedActionException("User authentication is required");
     }
     String email = authentication.getName();
     User user;
     try {
         user = userServiceClient.getUserByEmail(email);
     } catch (Exception e) {
         throw new com.cts.exception.FeignClientException("Failed to fetch user details: " + e.getMessage(), e);
     }
     if (user == null) {
         throw new UserNotFoundException("User not found with email: " + email);
     }
     
     // Note: This method needs getOrdersByCustomer endpoint in Order service
     // For now, returning empty list - you'll need to add this endpoint to foodservice
     return List.of();
 }
 
 public boolean isFoodRatingGiven(int orderId, long customerId, int foodId) {
     try {
         return feedbackRepo.existsByOrderIdAndCustomerAndFoodId(orderId, customerId, foodId);
     } catch (Exception e) {
         System.err.println("Error checking rating status: " + e.getMessage());
         e.printStackTrace();
         return false;
     }
 }
}
