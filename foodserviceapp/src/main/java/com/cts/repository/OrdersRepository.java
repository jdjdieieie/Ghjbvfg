package com.cts.repository;

import com.cts.entity.Order;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdersRepository extends JpaRepository<Order, Integer> {
    
    List<Order> findByCustomerOrderByIdDesc(Long customerId);
    List<Order> findByDeliveryPartnerOrderByIdDesc(Long deliveryPartnerId);
    List<Order> findAllByOrderByIdDesc();
}