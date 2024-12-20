package com.example.be.dto.tour;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TourList {
    private Integer id;
    private String image;
    private String src;
    private String title;
    private String location;
    private String product;
    private Integer price;
    private Boolean active;

    //cartList 에서 사용
    private LocalDate startDate;
    private LocalDate endDate;

    // 메인화면에서 사용
    private String content;
    private String partner;

    //평점
    private Integer reviewCnt;
    private Double rateAvg;
}
