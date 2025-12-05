package com.cts.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;
import com.cts.enums.OrderStatus;

import lombok.Data;

@Data
public class OrderPlacementResponseDTO {
    
	private int id;
	private int totalQty;
	private double totalPrice;
	private Double discountAmount;
	private String promoCode;
	private LocalDate orderDate;
	private LocalTime orderTime;
	private OrderStatus orderStatus;
    
}
