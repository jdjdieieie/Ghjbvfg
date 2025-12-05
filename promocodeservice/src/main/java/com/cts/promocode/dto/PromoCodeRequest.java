package com.cts.promocode.dto;

import com.cts.promocode.entity.DiscountType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PromoCodeRequest {

    @NotBlank
    private String code;

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private DiscountType discountType;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal discountValue;

    @PositiveOrZero
    private BigDecimal maxDiscountAmount;

    @PositiveOrZero
    private BigDecimal minOrderAmount;

    @Positive
    private Integer usageLimitPerCustomer = 1;

    @Positive
    private Integer maxRedemptions;

    private boolean active = true;

    @NotNull
    private LocalDateTime validFrom;

    @NotNull
    @Future
    private LocalDateTime validUntil;
}
