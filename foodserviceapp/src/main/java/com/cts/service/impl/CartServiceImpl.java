package com.cts.service.impl;

import com.cts.dto.request.CartRequestDTO;
import com.cts.dto.response.CartResponseDTO;
import com.cts.entity.Cart;
import com.cts.entity.Food;
import com.cts.exception.CartItemNotFoundException;
import com.cts.exception.FoodNotFoundException;
import com.cts.exception.FoodNotInStockException;
import com.cts.exception.UserNotFoundException;
import com.cts.repository.CartRepository;
import com.cts.repository.FoodRepository;
import com.cts.service.CartService;
import com.cts.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService {
    
    
    private final CartRepository cartRepository;
    private final UserService userService;
    private final FoodRepository foodRepository;
    
   
	@Override
    @Transactional
    public CartResponseDTO addToCart(Long userId, CartRequestDTO cartRequestDto) {
        System.out.println("CartService - Adding to cart - User ID: " + userId + ", Food ID: " + cartRequestDto.getFoodId());
        
  
        com.cts.model.User user = userService.getUserById(userId);
        if (user == null) {
            System.err.println("User not found with id: " + userId);
            throw new UserNotFoundException("User not found with id: " + userId);
        }
        
        System.out.println("User found: " + user.getName());
        
        Food food = foodRepository.findById(cartRequestDto.getFoodId())
                .orElseThrow(() -> {
                    System.err.println("Food not found with id: " + cartRequestDto.getFoodId());
                    return new FoodNotFoundException("Food not found with id: " + cartRequestDto.getFoodId());
                });
        
        System.out.println("Food found: " + food.getName());

        if (!food.isStatus()) {
            throw new FoodNotInStockException("Food item is not available");
        }

        List<Cart> existingCarts = cartRepository.findAllByUserIdAndFoodId(userId, cartRequestDto.getFoodId());
        
        Cart cart;
        if (!existingCarts.isEmpty()) {
            System.out.println("Updating existing cart item");

            cart = normalizeDuplicateCartEntries(existingCarts);
            cart.setQuantity(cart.getQuantity() + cartRequestDto.getQuantity());
        } else {
            System.out.println("Creating new cart item");

            cart = new Cart();
            cart.setUserId(userId);
            cart.setFood(food);
            cart.setQuantity(cartRequestDto.getQuantity());
        }
        
        cart = cartRepository.save(cart);
        System.out.println("Cart saved successfully with ID: " + cart.getId());
        return convertToDto(cart);
    }
    
    @Override
    @Transactional
    public CartResponseDTO updateQuantity(Long userId, int foodId, int quantity) {
        Cart cart = getCartOrThrow(userId, foodId);
        
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        
        cart.setQuantity(quantity);
        cart = cartRepository.save(cart);
        return convertToDto(cart);
    }
    
    @Override
    @Transactional
    public void removeFromCart(Long userId, int foodId) {
        Cart cart = getCartOrThrow(userId, foodId);
        
        cartRepository.delete(cart);
    }
    
    @Override
    public List<CartResponseDTO> getCartItems(Long userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        return cartItems.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }
    
    @Override
    public Map<String, Object> getCartSummary(Long userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        
        double totalAmount = cartItems.stream()
                .mapToDouble(cart -> cart.getFood().getPrice() * cart.getQuantity())
                .sum();
        
        int totalItems = cartItems.stream()
                .mapToInt(Cart::getQuantity)
                .sum();
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalAmount", totalAmount);
        summary.put("totalItems", totalItems);
        summary.put("itemCount", cartItems.size());
        
        return summary;
    }
    
    private CartResponseDTO convertToDto(Cart cart) {
        CartResponseDTO dto = new CartResponseDTO();
        dto.setId(cart.getId());
        dto.setFoodId(cart.getFood().getId());
        dto.setFoodName(cart.getFood().getName());
        dto.setFoodImage(cart.getFood().getImg());
        dto.setCategoryName(cart.getFood().getCategory() != null ? cart.getFood().getCategory().getName() : null);
        dto.setPrice(cart.getFood().getPrice());
        dto.setQuantity(cart.getQuantity());
        dto.setTotalPrice(cart.getFood().getPrice() * cart.getQuantity());
        dto.setCreatedAt(cart.getCreatedAt());
        return dto;
    }

    private Cart getCartOrThrow(Long userId, int foodId) {
        List<Cart> carts = cartRepository.findAllByUserIdAndFoodId(userId, foodId);
        if (carts.isEmpty()) {
            throw new CartItemNotFoundException("Cart item not found");
        }
        return normalizeDuplicateCartEntries(carts);
    }

    private Cart normalizeDuplicateCartEntries(List<Cart> carts) {
        Cart primary = carts.get(0);
        if (carts.size() == 1) {
            return primary;
        }
        int combinedQuantity = primary.getQuantity();
        List<Cart> duplicates = new ArrayList<>();
        for (int i = 1; i < carts.size(); i++) {
            Cart duplicate = carts.get(i);
            combinedQuantity += duplicate.getQuantity();
            duplicates.add(duplicate);
        }
        if (!duplicates.isEmpty()) {
            cartRepository.deleteAll(duplicates);
        }
        primary.setQuantity(combinedQuantity);
        return cartRepository.save(primary);
    }
}
