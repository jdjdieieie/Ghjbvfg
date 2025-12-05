package com.cts.promocode.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PromoCodeUsageResponse {
    private Long usageId;
    private Long promoCodeId;
    private String code;
    private Long customerId;
    private String customerEmail;
    private Integer orderId;
    private LocalDateTime usedAt;
    private BigDecimal orderTotal;
    private BigDecimal discountApplied;
}
