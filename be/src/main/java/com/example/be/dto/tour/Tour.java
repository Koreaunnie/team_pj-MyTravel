package com.example.be.dto.tour;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class Tour {
  private Integer id;
  private String title;
  private String product;
  private Integer price;
  private String location;
  private String content;
  private String partner;
  private LocalDateTime inserted;
  private List<TourImg> fileList;
}
