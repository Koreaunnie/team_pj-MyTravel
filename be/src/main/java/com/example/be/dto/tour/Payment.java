package com.example.be.dto.tour;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Payment {
  private String paymentId;
  private String tourId;
  private String product;
  private String partnerEmail;
  private LocalDate startDate;
  private LocalDate endDate;
  private Integer price;
}
