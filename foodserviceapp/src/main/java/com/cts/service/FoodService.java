package com.cts.service;

import com.cts.dto.request.FoodRequestDTO;
import com.cts.dto.response.FoodResponseDTO;

import org.springframework.data.domain.Page;

import java.util.List;

public interface FoodService {

    FoodResponseDTO addFoodWithCategoryName(FoodRequestDTO requestFood, String categoryName);
    List<FoodResponseDTO> getAllFood();
    FoodResponseDTO getFoodById(int id);
    Page<FoodResponseDTO> getFoodByCategory(String category,int page);
    FoodResponseDTO getFoodByName(String name);
    List<FoodResponseDTO> getFoodByStatus(boolean status);
    Page<FoodResponseDTO> getActiveFood(int page);
    FoodResponseDTO updateFood(int id, FoodRequestDTO requestFood);
    FoodResponseDTO updateFoodStatus(int id, boolean status);
    FoodResponseDTO updateFoodPrice(int id, double price);
    FoodResponseDTO updateFoodCategory(int id, String categoryName);
    FoodResponseDTO updateFoodName(int id, String name);
    FoodResponseDTO updateFoodDescription(int id, String description);
    FoodResponseDTO updateFoodImage(int id, String img);
    boolean isInStock(int foodId);

}
