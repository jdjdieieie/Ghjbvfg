package com.cts.promocode.repository;

import com.cts.promocode.entity.PromoCodeUsage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PromoCodeUsageRepository extends JpaRepository<PromoCodeUsage, Long> {
    boolean existsByPromoCodeIdAndCustomerId(Long promoCodeId, Long customerId);
    Optional<PromoCodeUsage> findByPromoCodeIdAndCustomerId(Long promoCodeId, Long customerId);
    List<PromoCodeUsage> findByPromoCodeId(Long promoCodeId);
    long countByPromoCodeIdAndCustomerId(Long promoCodeId, Long customerId);
}
