package com.cts.promocode.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "promo_code_usage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromoCodeUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promo_code_id", nullable = false)
    private PromoCode promoCode;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "customer_email", nullable = false)
    private String customerEmail;

    @Column(name = "order_id")
    private Integer orderId;

    @Column(nullable = false)
    private LocalDateTime usedAt;

    @Column(precision = 10, scale = 2)
    private BigDecimal orderTotal;

    @Column(precision = 10, scale = 2)
    private BigDecimal discountApplied;
}
