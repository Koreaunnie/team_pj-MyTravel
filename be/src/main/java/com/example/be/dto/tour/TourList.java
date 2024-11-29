package com.example.be.dto.tour;

import lombok.Data;

@Data
public class TourList {
  private Integer id;
  private String image;
  private String title;
  private String location;
  private String product;
  private Integer price;
  private String partner;
}
