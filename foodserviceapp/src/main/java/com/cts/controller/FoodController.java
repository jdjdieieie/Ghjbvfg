package com.cts.controller;

import java.util.List;

import com.cts.dto.request.FoodRequestDTO;
import com.cts.dto.response.FoodInStockResponseDTO;
import com.cts.dto.response.FoodResponseDTO;
import com.cts.dto.response.RatingResponseDTO;
import com.cts.repository.CartRepository;
import com.cts.repository.FoodRepository;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cts.service.FoodService;
import com.cts.service.UserService;

@RestController
@RequestMapping("/api/v1/food")
@AllArgsConstructor
public class FoodController {


    private final FoodService foodService;

    @PostMapping("/register")
    @Operation(summary = "Adding a Food", description = "Adding a Food")
    public ResponseEntity<FoodResponseDTO> addFood(@Valid @RequestBody FoodRequestDTO requestFood) {
        FoodResponseDTO responseFood = foodService.addFoodWithCategoryName(requestFood, requestFood.getCategoryName());
        return new ResponseEntity<>(responseFood, HttpStatus.CREATED);

    }

    @GetMapping
    @Operation(summary = "Getting all Food", description = "Getting all Food")
    public ResponseEntity<List<FoodResponseDTO>> getAllFood() {
        List<FoodResponseDTO> responseFoodlist = foodService.getAllFood();
        return new ResponseEntity<>(responseFoodlist, HttpStatus.OK);

    }

    @GetMapping("/id")
    @Operation(summary = "Getting Food by ID", description = "Getting Food by ID")
    public ResponseEntity<FoodResponseDTO> getFoodById(@RequestParam int id) {
        FoodResponseDTO responsefood = foodService.getFoodById(id);
        if (responsefood != null) {
            return new ResponseEntity<>(responsefood, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/category")
    @Operation(summary = "Getting Active Food by Category with pagination", description = "Getting Active Food by Category")
    public ResponseEntity<Page<FoodResponseDTO>> getFoodByCategory(@RequestParam String category,@RequestParam(defaultValue = "1") int page) {
    		Page<FoodResponseDTO> responseFoodlist = foodService.getFoodByCategory(category,page);
        
        return new ResponseEntity<>(responseFoodlist, HttpStatus.OK);

    }

    @GetMapping("/name")
    @Operation(summary = "Getting Food by name", description = "Getting Food by name")
    public ResponseEntity<FoodResponseDTO> getFoodByName(@RequestParam String name) {
        FoodResponseDTO responseFood = foodService.getFoodByName(name);
        return new ResponseEntity<>(responseFood, HttpStatus.OK);

    }
    @GetMapping("/active")
    @Operation(summary = "Getting Active Food with Pagination", description = "Getting active food items with pagination (page size = 8, page starts from 1)")
    public ResponseEntity<Page<FoodResponseDTO>> getActiveFood(@RequestParam(defaultValue = "1") int page) {
        Page<FoodResponseDTO> responseFoodPage = foodService.getActiveFood(page);
        return new ResponseEntity<>(responseFoodPage, HttpStatus.OK);
    }

    @PutMapping("/update/all")
    @Operation(summary = "Updating a Food by id", description = "Updating a Food")
    public ResponseEntity<FoodResponseDTO> updateFoodById(@RequestParam int id, @Valid @RequestBody FoodRequestDTO requestFood) {
        FoodResponseDTO responseFood = foodService.updateFood(id, requestFood);
        return new ResponseEntity<>(responseFood, HttpStatus.OK);

    }

    @PatchMapping("update/status")
    @Operation(summary = "Updating Food Status by id", description = "Updating Food Status by id")
    public ResponseEntity<FoodResponseDTO> updateFoodStatusById(@RequestParam int id, @RequestParam boolean status) {
        FoodResponseDTO responseFood = foodService.updateFoodStatus(id, status);
        return new ResponseEntity<>(responseFood, HttpStatus.OK);
    }
    @PatchMapping("update/price")
    @Operation(summary = "Updating Food Price by id", description = "Updating Food Price by id")
    public ResponseEntity<FoodResponseDTO> updateFoodPriceById(@RequestParam int id, @RequestParam double price) {
        FoodResponseDTO responseFood = foodService.updateFoodPrice(id, price);
        return new ResponseEntity<>(responseFood, HttpStatus.OK);
    }
    @PatchMapping("update/category")
    @Operation(summary = "Updating Food Category by id", description = "Updating Food Category by id")
    public ResponseEntity<FoodResponseDTO> updateFoodCategoryById(@RequestParam int id, @RequestParam String categoryName) {
        FoodResponseDTO responseFood = foodService.updateFoodCategory(id, categoryName);
        return new ResponseEntity<>(responseFood, HttpStatus.OK);
    }

    @PatchMapping("update/name")
    @Operation(summary = "Updating Food Name by id", description = "Updating Food Name by id")
    public ResponseEntity<FoodResponseDTO> updateFoodNameById(@RequestParam int id, @RequestParam String name) {
        FoodResponseDTO responseFood = foodService.updateFoodName(id, name);
        return new ResponseEntity<>(responseFood, HttpStatus.OK);
    }
    @PatchMapping("update/description")
    @Operation(summary = "Updating Food Description by id", description = "Updating Food Description by id")
    public ResponseEntity<FoodResponseDTO> updateFoodDescriptionById(@RequestParam int id, @RequestParam String description) {
        FoodResponseDTO responseFood = foodService.updateFoodDescription(id, description);
        return new ResponseEntity<>(responseFood, HttpStatus.OK);
    }
    @PatchMapping("update/img")
    @Operation(summary = "Updating Food Image by id", description = "Updating Food Image by id")
    public ResponseEntity<FoodResponseDTO> updateFoodImageById(@RequestParam int id, @RequestParam String img) {
        FoodResponseDTO responseFood = foodService.updateFoodImage(id, img);
        return new ResponseEntity<>(responseFood, HttpStatus.OK);
    }
    
    @GetMapping("find/instock")
    @Operation(summary = "Get Whether Food is InStock or Not", description = "Returns the true if Food is InStock.")
    public ResponseEntity<FoodInStockResponseDTO> isFoodInStock(@RequestParam int foodId) {
    Boolean stock = foodService.isInStock(foodId);
    	FoodInStockResponseDTO response=new FoodInStockResponseDTO();
    	response.setInStock(stock);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/rating")
    @Operation(summary = "Update food average rating", description = "Used by Feedback service to persist average rating")
    public ResponseEntity<Void> updateFoodRating(@PathVariable int id, @RequestParam float avgRating) {
        foodService.updateFoodRating(id, avgRating);
        return ResponseEntity.ok().build();
    }

}