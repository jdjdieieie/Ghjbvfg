package com.cts.dto.promo;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class PromoCodeRedeemRequestDTO extends PromoCodeValidationRequestDTO {

    private Integer orderId;
}
