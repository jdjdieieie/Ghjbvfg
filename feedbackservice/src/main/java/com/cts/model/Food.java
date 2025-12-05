package com.cts.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Food {
	private int id;
	private String name;
	private String img;
	private double price;
	private String description;
	private boolean status;
	private float avgRating;
	private String categoryName;
}
