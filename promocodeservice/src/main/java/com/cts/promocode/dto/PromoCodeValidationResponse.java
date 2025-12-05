package com.cts.promocode.dto;

import com.cts.promocode.entity.DiscountType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PromoCodeValidationResponse {
    private String code;
    private boolean valid;
    private String message;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
}
