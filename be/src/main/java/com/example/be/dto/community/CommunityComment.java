package com.example.be.dto.community;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CommunityComment {
    private Integer id;
    private String comment;
    private String writer;
    private LocalDateTime creationDate;
    private String communityId;
}
