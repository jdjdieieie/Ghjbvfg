package com.cts.promocode.service.impl;

import com.cts.promocode.dto.PromoCodeExpiryRequest;
import com.cts.promocode.dto.PromoCodeRedeemRequest;
import com.cts.promocode.dto.PromoCodeRequest;
import com.cts.promocode.dto.PromoCodeResponse;
import com.cts.promocode.dto.PromoCodeUpdateRequest;
import com.cts.promocode.dto.PromoCodeUsageResponse;
import com.cts.promocode.dto.PromoCodeValidationRequest;
import com.cts.promocode.dto.PromoCodeValidationResponse;
import com.cts.promocode.entity.DiscountType;
import com.cts.promocode.entity.PromoCode;
import com.cts.promocode.entity.PromoCodeUsage;
import com.cts.promocode.exception.PromoCodeAlreadyUsedException;
import com.cts.promocode.exception.PromoCodeException;
import com.cts.promocode.exception.PromoCodeExpiredException;
import com.cts.promocode.exception.PromoCodeInactiveException;
import com.cts.promocode.exception.PromoCodeNotFoundException;
import com.cts.promocode.repository.PromoCodeRepository;
import com.cts.promocode.repository.PromoCodeUsageRepository;
import com.cts.promocode.service.PromoCodeService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PromoCodeServiceImpl implements PromoCodeService {

    private final PromoCodeRepository promoCodeRepository;
    private final PromoCodeUsageRepository promoCodeUsageRepository;
    private final ModelMapper modelMapper;

    @Override
    public PromoCodeResponse createPromoCode(PromoCodeRequest request) {
        if (promoCodeRepository.existsByCodeIgnoreCase(request.getCode())) {
            throw new PromoCodeException("Promo code already exists");
        }
        PromoCode promoCode = modelMapper.map(request, PromoCode.class);
        promoCode.setCode(request.getCode().toUpperCase());
        promoCode.setCreatedAt(LocalDateTime.now());
        promoCode.setUpdatedAt(LocalDateTime.now());
        promoCode.setTotalRedemptions(0);
        promoCode = promoCodeRepository.save(promoCode);
        return mapToResponse(promoCode);
    }

    @Override
    public PromoCodeResponse updatePromoCode(Long id, PromoCodeUpdateRequest request) {
        PromoCode promoCode = getPromoCodeEntity(id);

        if (request.getTitle() != null) promoCode.setTitle(request.getTitle());
        if (request.getDescription() != null) promoCode.setDescription(request.getDescription());
        if (request.getDiscountType() != null) promoCode.setDiscountType(request.getDiscountType());
        if (request.getDiscountValue() != null) promoCode.setDiscountValue(request.getDiscountValue());
        if (request.getMaxDiscountAmount() != null) promoCode.setMaxDiscountAmount(request.getMaxDiscountAmount());
        if (request.getMinOrderAmount() != null) promoCode.setMinOrderAmount(request.getMinOrderAmount());
        if (request.getUsageLimitPerCustomer() != null) promoCode.setUsageLimitPerCustomer(request.getUsageLimitPerCustomer());
        if (request.getMaxRedemptions() != null) promoCode.setMaxRedemptions(request.getMaxRedemptions());
        if (request.getActive() != null) promoCode.setActive(request.getActive());
        if (request.getValidFrom() != null) promoCode.setValidFrom(request.getValidFrom());
        if (request.getValidUntil() != null) promoCode.setValidUntil(request.getValidUntil());

        promoCode.setUpdatedAt(LocalDateTime.now());
        return mapToResponse(promoCodeRepository.save(promoCode));
    }

    @Override
    public void deletePromoCode(Long id) {
        PromoCode promoCode = getPromoCodeEntity(id);
        promoCodeRepository.delete(promoCode);
    }

    @Override
    public PromoCodeResponse getPromoCode(Long id) {
        return mapToResponse(getPromoCodeEntity(id));
    }

    @Override
    public List<PromoCodeResponse> getAllPromoCodes() {
        return promoCodeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PromoCodeResponse updateExpiry(Long id, PromoCodeExpiryRequest request) {
        PromoCode promoCode = getPromoCodeEntity(id);
        promoCode.setValidUntil(request.getValidUntil());
        promoCode.setUpdatedAt(LocalDateTime.now());
        return mapToResponse(promoCodeRepository.save(promoCode));
    }

    @Override
    public List<PromoCodeUsageResponse> getUsageForPromo(Long id) {
        PromoCode promoCode = getPromoCodeEntity(id);
        return promoCodeUsageRepository.findByPromoCodeId(promoCode.getId()).stream()
                .map(this::mapUsageToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PromoCodeValidationResponse validatePromo(PromoCodeValidationRequest request) {
        PromoCode promoCode = promoCodeRepository.findByCodeIgnoreCase(request.getCode())
                .orElseThrow(() -> new PromoCodeNotFoundException("Promo code not found"));
        validatePromoEligibility(promoCode, request.getCustomerId(), request.getOrderTotal());
        return buildValidationResponse(promoCode, request.getOrderTotal());
    }

    @Override
    public PromoCodeValidationResponse redeemPromo(PromoCodeRedeemRequest request) {
        PromoCode promoCode = promoCodeRepository.findByCodeIgnoreCase(request.getCode())
                .orElseThrow(() -> new PromoCodeNotFoundException("Promo code not found"));
        validatePromoEligibility(promoCode, request.getCustomerId(), request.getOrderTotal());

        PromoCodeUsage usage = PromoCodeUsage.builder()
                .promoCode(promoCode)
                .customerId(request.getCustomerId())
                .customerEmail(request.getCustomerEmail())
                .orderId(request.getOrderId())
                .usedAt(LocalDateTime.now())
                .orderTotal(request.getOrderTotal())
                .discountApplied(calculateDiscount(promoCode, request.getOrderTotal()))
                .build();
        promoCodeUsageRepository.save(usage);

        promoCode.setTotalRedemptions(promoCode.getTotalRedemptions() + 1);
        promoCodeRepository.save(promoCode);

        return buildValidationResponse(promoCode, request.getOrderTotal());
    }

    private PromoCodeResponse mapToResponse(PromoCode promoCode) {
        return PromoCodeResponse.builder()
                .id(promoCode.getId())
                .code(promoCode.getCode())
                .title(promoCode.getTitle())
                .description(promoCode.getDescription())
                .discountType(promoCode.getDiscountType())
                .discountValue(promoCode.getDiscountValue())
                .maxDiscountAmount(promoCode.getMaxDiscountAmount())
                .minOrderAmount(promoCode.getMinOrderAmount())
                .usageLimitPerCustomer(promoCode.getUsageLimitPerCustomer())
                .maxRedemptions(promoCode.getMaxRedemptions())
                .totalRedemptions(promoCode.getTotalRedemptions())
                .active(promoCode.isActive())
                .validFrom(promoCode.getValidFrom())
                .validUntil(promoCode.getValidUntil())
                .createdAt(promoCode.getCreatedAt())
                .updatedAt(promoCode.getUpdatedAt())
                .build();
    }

    private PromoCodeUsageResponse mapUsageToResponse(PromoCodeUsage usage) {
        return PromoCodeUsageResponse.builder()
                .usageId(usage.getId())
                .promoCodeId(usage.getPromoCode().getId())
                .code(usage.getPromoCode().getCode())
                .customerId(usage.getCustomerId())
                .customerEmail(usage.getCustomerEmail())
                .orderId(usage.getOrderId())
                .usedAt(usage.getUsedAt())
                .orderTotal(usage.getOrderTotal())
                .discountApplied(usage.getDiscountApplied())
                .build();
    }

    private PromoCode getPromoCodeEntity(Long id) {
        return promoCodeRepository.findById(id)
                .orElseThrow(() -> new PromoCodeNotFoundException("Promo code not found"));
    }

    private void validatePromoEligibility(PromoCode promoCode, Long customerId, BigDecimal orderTotal) {
        if (!promoCode.isActive()) {
            throw new PromoCodeInactiveException("Promo code is inactive");
        }
        if (promoCode.getValidFrom() != null && LocalDateTime.now().isBefore(promoCode.getValidFrom())) {
            throw new PromoCodeExpiredException("Promo code is not yet active");
        }
        if (promoCode.getValidUntil() != null && LocalDateTime.now().isAfter(promoCode.getValidUntil())) {
            throw new PromoCodeExpiredException("Promo code has expired");
        }
        if (promoCode.getMinOrderAmount() != null && orderTotal.compareTo(promoCode.getMinOrderAmount()) < 0) {
            throw new PromoCodeException("Order total does not meet minimum requirement");
        }
        if (promoCode.getMaxRedemptions() != null && promoCode.getTotalRedemptions() >= promoCode.getMaxRedemptions()) {
            throw new PromoCodeException("Promo code redemption limit reached");
        }
        validateCustomerUsageLimit(promoCode, customerId);
    }

    private PromoCodeValidationResponse buildValidationResponse(PromoCode promoCode, BigDecimal orderTotal) {
        BigDecimal discountAmount = calculateDiscount(promoCode, orderTotal);
        BigDecimal finalAmount = orderTotal.subtract(discountAmount);

        return PromoCodeValidationResponse.builder()
                .code(promoCode.getCode())
                .valid(true)
                .message("Promo code applied successfully")
                .discountType(promoCode.getDiscountType())
                .discountValue(promoCode.getDiscountValue())
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .build();
    }

    private BigDecimal calculateDiscount(PromoCode promoCode, BigDecimal orderTotal) {
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (promoCode.getDiscountType() == DiscountType.FLAT) {
            discountAmount = promoCode.getDiscountValue();
        } else if (promoCode.getDiscountType() == DiscountType.PERCENTAGE) {
            discountAmount = orderTotal.multiply(promoCode.getDiscountValue())
                    .divide(BigDecimal.valueOf(100));
        }

        if (promoCode.getMaxDiscountAmount() != null) {
            discountAmount = discountAmount.min(promoCode.getMaxDiscountAmount());
        }
        return discountAmount.min(orderTotal);
    }

    private void validateCustomerUsageLimit(PromoCode promoCode, Long customerId) {
        if (promoCode.getUsageLimitPerCustomer() == null) {
            return;
        }
        long count = promoCodeUsageRepository.countByPromoCodeIdAndCustomerId(promoCode.getId(), customerId);
        if (count >= promoCode.getUsageLimitPerCustomer()) {
            throw new PromoCodeAlreadyUsedException("Promo code usage limit reached for this customer");
        }
    }
}
