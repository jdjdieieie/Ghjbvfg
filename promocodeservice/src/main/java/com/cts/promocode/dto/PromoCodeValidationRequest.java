package com.cts.promocode.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PromoCodeValidationRequest {

    @NotBlank
    private String code;

    @NotNull
    private Long customerId;

    @NotBlank
    private String customerEmail;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal orderTotal;
}
