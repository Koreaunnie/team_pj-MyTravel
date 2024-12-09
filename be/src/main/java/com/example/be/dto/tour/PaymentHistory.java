package com.example.be.dto.tour;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PaymentHistory {
  private String paymentId;
  private String currency;
  private String product;
  private String location;
  private LocalDateTime paidAt;
  private Integer tourId;
  private LocalDate startDate;
  private LocalDate endDate;
  private Integer price;
  private String buyerEmail;
}
