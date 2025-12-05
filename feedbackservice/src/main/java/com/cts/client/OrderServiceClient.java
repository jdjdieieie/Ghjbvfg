package com.cts.client;

import com.cts.model.Order;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "FOODSERVICEAPP", path = "/api/v1/orders", contextId = "orderServiceClient")
public interface OrderServiceClient {
    
    @GetMapping("/{id}")
    Order getOrderById(@PathVariable("id") int id);
}
