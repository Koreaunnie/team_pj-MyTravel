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


                String filePath = STR."C:/Temp/teamPrj1126/\{community.getId()}/\{file.getOriginalFilename()}";
                try {
                    file.transferTo(new File(filePath));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        }

        System.out.println(id);

        for (MultipartFile file : files) {
            String filesName = file.getOriginalFilename();
            try {
                byte[] fileData = file.getBytes();
                mapper.addFile(filesName, id);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }


    }

    public Map<String, Object> view(Integer id) {
        return mapper.viewCommunity(id);
    }

    public void edit(Community community) {
        mapper.editCommunity(community);
    }

    public void delete(Integer id) {
        mapper.deleteCommunity(id);
    }
}
