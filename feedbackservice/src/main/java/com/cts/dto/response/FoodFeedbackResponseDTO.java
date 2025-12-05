package com.cts.dto.response;

import java.time.LocalDate;

import lombok.Data;

@Data
public class FoodFeedbackResponseDTO {
	
    private Long feedbackId;
    private Integer foodRating;
    private LocalDate dateOfFeedback;
    private Integer foodId;
    private Integer orderId;

}
