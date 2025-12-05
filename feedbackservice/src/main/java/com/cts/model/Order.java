package com.cts.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.cts.enums.OrderStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Order {
	private int id;
	private Integer totalQty;
	private Double totalPrice;
	private LocalDate orderDate;
	private LocalTime orderTime;
	private OrderStatus orderStatus;
	private String otp;
	private long customer;
	private long deliveryPartner;
	
	@JsonManagedReference
	private List<OrderItem> orderItems;
}
