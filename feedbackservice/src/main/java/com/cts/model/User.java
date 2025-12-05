package com.cts.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Long id;
    private String email;
    private String name;
    private String phno;
    private String location;
    private boolean status;
    private Boolean availabilityStatus;
    private String role;
    private int totalOrders;
    
    public User(Long id, String email, String name, String role) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
    }
}
