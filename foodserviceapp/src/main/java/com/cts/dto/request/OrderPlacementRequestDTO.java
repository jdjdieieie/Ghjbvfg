package com.cts.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class OrderPlacementRequestDTO { 
    @NotNull(message = "Address is required")
    @Valid
    private OrderAddressDTO address;
    
    @NotNull(message = "Items list is required")
    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemDTO> items;

    @Size(max = 50, message = "Promo code must be 50 characters or fewer")
    private String promoCode;

}