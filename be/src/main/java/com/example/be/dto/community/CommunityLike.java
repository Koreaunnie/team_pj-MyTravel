package com.example.be.dto.community;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CommunityLike {
    private Integer communityId;
    private String nickName;
}
