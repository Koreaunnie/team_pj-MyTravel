package com.example.be.dto.community;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CommunityFile {
    private Integer id;
    private String fileName;
    private Integer communityId;
    private MultipartFile[] filePath;
}
