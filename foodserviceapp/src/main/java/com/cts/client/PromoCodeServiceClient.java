package com.cts.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.cts.dto.promo.PromoCodeRedeemRequestDTO;
import com.cts.dto.promo.PromoCodeValidationRequestDTO;
import com.cts.dto.promo.PromoCodeValidationResponseDTO;

@FeignClient(name = "PROMOCODESERVICEAPP", path = "/api/v1/promocodes")
public interface PromoCodeServiceClient {

    @PostMapping("/validate")
    PromoCodeValidationResponseDTO validatePromo(@RequestBody PromoCodeValidationRequestDTO request);

    @PostMapping("/redeem")
    PromoCodeValidationResponseDTO redeemPromo(@RequestBody PromoCodeRedeemRequestDTO request);
}
