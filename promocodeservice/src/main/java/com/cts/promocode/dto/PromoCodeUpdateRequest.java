package com.cts.promocode.dto;

import com.cts.promocode.entity.DiscountType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PromoCodeUpdateRequest {
    private String title;
    private String description;
    private DiscountType discountType;

    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal discountValue;

    @PositiveOrZero
    private BigDecimal maxDiscountAmount;

    @PositiveOrZero
    private BigDecimal minOrderAmount;

    @Positive
    private Integer usageLimitPerCustomer;

    @Positive
    private Integer maxRedemptions;

    private Boolean active;

    private LocalDateTime validFrom;

    @Future
    private LocalDateTime validUntil;
}
