package com.cts.dto.response;

import lombok.Data;

@Data
public class UserResponseDTO {
	
    private long id;
    private String email;
    private String name;
    private String phno;
    private String location;
    private String role;
    private Boolean availabilityStatus;
    private boolean availabilityLocked;
    private int totalOrders;
    
}
