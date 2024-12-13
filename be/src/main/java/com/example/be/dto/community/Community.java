package com.example.be.dto.community;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class Community {
    private Integer id;
    private String title;
    private String writer;
    private String content;
    private LocalDateTime creationDate;

    private boolean existOfFiles;
    private String numberOfComments;
    private Integer numberOfLikes;

    private List<CommunityFile> communityFileList;
}