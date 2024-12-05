package com.example.be.service.community;

import com.example.be.dto.community.Community;
import com.example.be.mapper.community.CommunityMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommunityService {

    final CommunityMapper mapper;

    @Value("${image.src.prefix}")
    String imageSrcPrefix;

    @Value("${bucket.name}")
    String bucketName;

    public List<Map<String, Object>> list(Integer page, String searchType, String searchKeyword) {

        Integer pageList = (page - 1) * 10;

        return mapper.listUp(pageList, searchType, searchKeyword);
    }

    public void write(Community community, MultipartFile[] files, Authentication auth) {


        String nickname = mapper.findNickname(auth.getName());
        community.setWriter(nickname);
        mapper.writeCommunity(community);
        Integer id = community.getId();

        if (files != null && files.length > 0) {

            String directory = STR."C:/Temp/teamPrj1126/\{id}";
            File dir = new File(directory);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // 파일 업로드
            // TODO: local -> aws

            for (MultipartFile file : files) {

                String fileName = file.getOriginalFilename();
                String filePath = STR."C:/Temp/teamPrj1126/\{community.getId()}/\{fileName}";
                try {
                    file.transferTo(new File(filePath));
                    mapper.addFile(fileName, id);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        }


    }

    public Map<String, Object> view(Integer id) {

        Community community = new Community();
        community.setId(id);
        Map<String, Object> viewer = mapper.viewCommunity(id);
        System.out.println(mapper.viewCommunity(id));
        // Map
        List<String> fileList = mapper.callCommunityFile(id);
        System.out.println(mapper.callCommunityFile(id));
        // List

        System.out.println(fileList.size());
        if (fileList.size() != 0) {
            for (String fileName : fileList) {
                String filePath = STR."C:/Temp/teamPrj1126/\{viewer.get("id").toString()}/\{fileName}";
                viewer.put("file_path", filePath);
                return viewer;

            }
        }

        return null;
//        if (viewer.containsKey("file_name")) {
//            String fileName = viewer.get("file_name").toString();
//            String filePath = STR."C:/Temp/teamPrj1126/\{viewer.get("id").toString()}/\{fileName}";
//            viewer.put("file_path", filePath);
//            System.out.println(viewer);
//            return viewer;
//        } else {
//            return viewer;
//        }
    }

    public void edit(Community community) {
        mapper.editCommunity(community);
    }

    public void delete(Integer id) {
        mapper.deleteCommunity(id);
    }
}
