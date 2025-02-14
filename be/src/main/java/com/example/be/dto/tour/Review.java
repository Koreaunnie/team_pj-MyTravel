package com.example.be.dto.tour;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class Review {
    private Integer reviewId;
    private Integer tourId;
    private String paymentId;
    private String writerEmail;
    private String writerNickname;
    private String review;
    private Integer rating;
    private LocalDateTime inserted;
    private List<TourImg> imageList;
}
