package com.cts.client;

import com.cts.model.Food;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "FOODSERVICEAPP", path = "/api/v1/food", contextId = "foodServiceClient")
public interface FoodServiceClient {
    
    @GetMapping("/{id}")
    Food getFoodById(@PathVariable("id") int id);
    
    @PutMapping("/{id}/rating")
    void updateFoodRating(@PathVariable("id") int id, @RequestParam("avgRating") float avgRating);
}
