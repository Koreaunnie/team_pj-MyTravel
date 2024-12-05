package com.example.be.dto.tour;

import lombok.Data;

import java.util.List;

@Data
public class Payment {
  private List<TourList> tourList;
  private String paymentId;
  private Integer amount;
  private String currency;
  private String payMethod;
  private String buyer;
}
