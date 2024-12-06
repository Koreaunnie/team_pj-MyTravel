package com.example.be.service.community;

import com.example.be.dto.community.Community;
import com.example.be.mapper.community.CommunityMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommunityService {

  final CommunityMapper mapper;
  final S3Client s3;


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

      for (MultipartFile file : files) {

        String fileName = file.getOriginalFilename();
        String filePath = STR."teamPrj1126/community/\{community.getId()}/\{fileName}";
        PutObjectRequest por = PutObjectRequest
                .builder()
                .bucket(bucketName)
                .key(filePath)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        try {
          s3.putObject(por, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (IOException e) {
          throw new RuntimeException(e);
        }

        mapper.addFile(fileName, id);
      }
    }


  }

  public Map<String, Object> view(Integer id) {

    Map<String, Object> viewer = mapper.viewCommunity(id);
    List<String> fileList = mapper.callCommunityFile(id);
    if (fileList.size() != 0) {
      List<Object> files = new ArrayList();
      for (String fileName : fileList) {
        Map<String, Object> file = new HashMap<>();
        String filePath = STR."\{imageSrcPrefix}/\{viewer.get("id").toString()}/\{fileName}";
        file.put("fileName", fileName);
        file.put("filePath", filePath);
        files.add(file);
      }
      viewer.put("files", files);
      return viewer;
    } else {
      return viewer;
    }
  }

  public void edit(Community community) {
    mapper.editCommunity(community);
  }

  public void delete(Integer id) {
    mapper.deleteCommunity(id);
  }
}
