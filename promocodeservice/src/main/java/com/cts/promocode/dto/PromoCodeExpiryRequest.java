package com.cts.promocode.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PromoCodeExpiryRequest {
    @NotNull
    @Future
    private LocalDateTime validUntil;
}
