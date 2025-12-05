package com.cts.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "role")
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(name = "email", unique = true, nullable = false)
	private String email;
	@Column(nullable = false)
	private String password;
	@Column(nullable = false)
	private String name;
	@Column(nullable = false,unique = true)
	private String phno;
	@Column(nullable = false)
	private String location;
	private boolean status = true;
	@Column(name = "availability_status")
	private Boolean availabilityStatus = true;
	@Column(name = "availability_lock")
	private boolean availabilityLocked = false;
	@Column(name = "role", insertable = false, updatable = false)
	private String role;
	@Column(columnDefinition = "int default 0")
	private int totalOrders = 0;

}
