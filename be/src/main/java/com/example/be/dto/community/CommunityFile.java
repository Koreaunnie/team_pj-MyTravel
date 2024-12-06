package com.example.be.dto.community;

import lombok.Data;

@Data
public class CommunityFile {
    private Integer id;
    private String fileName;
    private Integer communityId;
    private String filePath;
}
