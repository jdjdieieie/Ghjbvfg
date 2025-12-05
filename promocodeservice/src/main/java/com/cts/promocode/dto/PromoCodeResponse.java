package com.cts.promocode.dto;

import com.cts.promocode.entity.DiscountType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PromoCodeResponse {
    private Long id;
    private String code;
    private String title;
    private String description;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal maxDiscountAmount;
    private BigDecimal minOrderAmount;
    private Integer usageLimitPerCustomer;
    private Integer maxRedemptions;
    private Integer totalRedemptions;
    private boolean active;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
