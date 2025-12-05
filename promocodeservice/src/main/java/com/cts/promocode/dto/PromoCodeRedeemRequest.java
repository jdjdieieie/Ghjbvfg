package com.cts.promocode.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PromoCodeRedeemRequest extends PromoCodeValidationRequest {

    @NotNull
    private Integer orderId;
}
