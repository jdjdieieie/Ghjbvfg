package com.cts.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FoodFeedbackRequestDTO {

    @NotNull(message = "Food rating is required")
    @Min(value = 1, message = "Food rating must be at least 1")
    @Max(value = 5, message = "Food rating must be at most 5")
    private Integer foodRating;
    
    @NotNull(message = "Order ID is required")
    private Integer orderId;

}
