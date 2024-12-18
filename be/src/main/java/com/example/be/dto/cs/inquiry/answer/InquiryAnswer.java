package com.example.be.dto.cs.inquiry.answer;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InquiryAnswer {
    private Integer id;
    private Integer inquiryId;
    private String memberEmail;
    private String memberNickname;
    private String answer;
    private LocalDateTime inserted;
    private LocalDateTime updated;
}
