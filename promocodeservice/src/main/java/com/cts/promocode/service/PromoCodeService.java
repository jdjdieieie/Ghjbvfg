package com.cts.promocode.service;

import com.cts.promocode.dto.PromoCodeExpiryRequest;
import com.cts.promocode.dto.PromoCodeRedeemRequest;
import com.cts.promocode.dto.PromoCodeRequest;
import com.cts.promocode.dto.PromoCodeResponse;
import com.cts.promocode.dto.PromoCodeUpdateRequest;
import com.cts.promocode.dto.PromoCodeUsageResponse;
import com.cts.promocode.dto.PromoCodeValidationRequest;
import com.cts.promocode.dto.PromoCodeValidationResponse;

import java.util.List;

public interface PromoCodeService {

    PromoCodeResponse createPromoCode(PromoCodeRequest request);

    PromoCodeResponse updatePromoCode(Long id, PromoCodeUpdateRequest request);

    void deletePromoCode(Long id);

    PromoCodeResponse getPromoCode(Long id);

    List<PromoCodeResponse> getAllPromoCodes();

    PromoCodeResponse updateExpiry(Long id, PromoCodeExpiryRequest request);

    List<PromoCodeUsageResponse> getUsageForPromo(Long id);

    PromoCodeValidationResponse validatePromo(PromoCodeValidationRequest request);

    PromoCodeValidationResponse redeemPromo(PromoCodeRedeemRequest request);
}
