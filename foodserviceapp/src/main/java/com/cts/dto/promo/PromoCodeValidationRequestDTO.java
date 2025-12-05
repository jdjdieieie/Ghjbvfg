package com.cts.dto.promo;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class PromoCodeValidationRequestDTO {

    private String code;
    private Long customerId;
    private String customerEmail;
    private BigDecimal orderTotal;
}
