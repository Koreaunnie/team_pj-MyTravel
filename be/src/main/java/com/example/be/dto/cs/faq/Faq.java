package com.example.be.dto.cs.faq;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Faq {
    private Integer id;
    private String question;
    private String answer;
    private String writer;
    private LocalDateTime inserted;
    private LocalDateTime updated;
}
