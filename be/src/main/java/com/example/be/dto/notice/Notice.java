package com.example.be.dto.notice;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Notice {
    private Integer id;
    private String title;
    private String writer;
    private String content;
    private LocalDateTime creationDate;

    private Integer numberOfLikes;
    private Integer numberOfViews;
}
