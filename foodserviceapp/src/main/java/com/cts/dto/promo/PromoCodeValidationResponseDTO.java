package com.cts.dto.promo;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class PromoCodeValidationResponseDTO {

    private String code;
    private boolean valid;
    private String message;
    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
}
