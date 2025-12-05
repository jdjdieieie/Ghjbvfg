package com.cts.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.cts.dto.request.OrderAddressDTO;
import com.cts.enums.OrderStatus;
import lombok.Data;

@Data
public class OrderResponseDTO {

    private int id;
	private int totalQty;
	private double totalPrice;
    private Double discountAmount;
    private String promoCode;
	private LocalDate orderDate;
	private LocalTime orderTime;
	private OrderStatus orderStatus;
	private String otp;
    private int customerId;
    private String customerName;
    private int deliveryPartnerId;
    private String assignDeliveryPerson;
    private OrderAddressDTO orderAddress;
    private List<OrderItemResponseDTO> orderItems;

}