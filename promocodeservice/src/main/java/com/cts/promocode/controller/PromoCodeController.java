package com.cts.promocode.controller;

import com.cts.promocode.dto.PromoCodeExpiryRequest;
import com.cts.promocode.dto.PromoCodeRedeemRequest;
import com.cts.promocode.dto.PromoCodeRequest;
import com.cts.promocode.dto.PromoCodeResponse;
import com.cts.promocode.dto.PromoCodeUpdateRequest;
import com.cts.promocode.dto.PromoCodeUsageResponse;
import com.cts.promocode.dto.PromoCodeValidationRequest;
import com.cts.promocode.dto.PromoCodeValidationResponse;
import com.cts.promocode.service.PromoCodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/promocodes")
@RequiredArgsConstructor
@Tag(name = "Promo Code Management")
public class PromoCodeController {

    private final PromoCodeService promoCodeService;

    @PostMapping
    @Operation(summary = "Create promo code")
    public ResponseEntity<PromoCodeResponse> createPromo(@Valid @RequestBody PromoCodeRequest request) {
        return new ResponseEntity<>(promoCodeService.createPromoCode(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update promo code")
    public ResponseEntity<PromoCodeResponse> updatePromo(@PathVariable Long id,
                                                         @Valid @RequestBody PromoCodeUpdateRequest request) {
        return ResponseEntity.ok(promoCodeService.updatePromoCode(id, request));
    }

    @PatchMapping("/{id}/expiry")
    @Operation(summary = "Update promo code expiry")
    public ResponseEntity<PromoCodeResponse> updateExpiry(@PathVariable Long id,
                                                          @Valid @RequestBody PromoCodeExpiryRequest request) {
        return ResponseEntity.ok(promoCodeService.updateExpiry(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete promo code")
    public ResponseEntity<Void> deletePromo(@PathVariable Long id) {
        promoCodeService.deletePromoCode(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromoCodeResponse> getPromo(@PathVariable Long id) {
        return ResponseEntity.ok(promoCodeService.getPromoCode(id));
    }

    @GetMapping
    public ResponseEntity<List<PromoCodeResponse>> getPromos() {
        return ResponseEntity.ok(promoCodeService.getAllPromoCodes());
    }

    @GetMapping("/{id}/usage")
    public ResponseEntity<List<PromoCodeUsageResponse>> getPromoUsage(@PathVariable Long id) {
        return ResponseEntity.ok(promoCodeService.getUsageForPromo(id));
    }

    @PostMapping("/validate")
    public ResponseEntity<PromoCodeValidationResponse> validatePromo(@Valid @RequestBody PromoCodeValidationRequest request) {
        return ResponseEntity.ok(promoCodeService.validatePromo(request));
    }

    @PostMapping("/redeem")
    public ResponseEntity<PromoCodeValidationResponse> redeemPromo(@Valid @RequestBody PromoCodeRedeemRequest request) {
        return ResponseEntity.ok(promoCodeService.redeemPromo(request));
    }
}
