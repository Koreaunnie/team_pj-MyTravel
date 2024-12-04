package com.example.be.dto.tour;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Cart {
  private LocalDate startDate;
  private LocalDate endDate;
}
