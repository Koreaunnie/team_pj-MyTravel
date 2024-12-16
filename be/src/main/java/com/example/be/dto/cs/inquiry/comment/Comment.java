package com.example.be.dto.cs.inquiry.comment;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Comment {
    private Integer id;
    private Integer inquiryId;
    private String memberEmail;
    private String memberNickname;
    private String comment;
    private LocalDateTime inserted;
    private LocalDateTime updated;
}
