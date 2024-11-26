package com.example.be.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Community {
    private Integer id;
    private String title;
    private String writer;
    private String content;
    private LocalDateTime creationDate;
}
