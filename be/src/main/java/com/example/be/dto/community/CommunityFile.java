package com.example.be.dto.community;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CommunityFile {
    private Integer id;
    private String fileName;
    private Integer communityId;
    private String filePath;
}
