package com.example.be.dto.cs.inquiry;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Inquiry {
    private Integer id;
    private String writer;
    private String writerNickname;
    private String category;
    private String title;
    private String content;
    private boolean secret;
    private LocalDateTime inserted;
    private LocalDateTime updated;
    private boolean hasAnswer;
}
