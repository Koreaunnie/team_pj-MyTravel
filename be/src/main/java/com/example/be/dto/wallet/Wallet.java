package com.example.be.dto.wallet;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class Wallet {
    private Integer id;
    private LocalDate date;
    private String category;
    private String title;
    private Integer income;
    private Integer expense;
    private String paymentMethod;
    private String memo;
    private LocalDateTime inserted;
    private String writer;
    private Integer paymentDetailId;
}
