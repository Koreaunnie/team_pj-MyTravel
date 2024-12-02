package com.example.be.dto.wallet;

import lombok.Data;

@Data
public class Wallet {
    private String date;
    private String category;
    private String title;
    private String income;
    private String expense;
    private String balance;
    private String paymentMethod;
    private String memo;
}
