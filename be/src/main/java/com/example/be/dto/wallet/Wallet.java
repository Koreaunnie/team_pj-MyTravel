package com.example.be.dto.wallet;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Wallet {
    private Integer id;
    private LocalDate date;
    private String category;
    private String title;
    private String income;
    private String expense;
    private String paymentMethod;
    private String memo;
}
