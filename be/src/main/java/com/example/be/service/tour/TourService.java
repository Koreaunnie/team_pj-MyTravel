package com.example.be.service.tour;

import com.example.be.dto.tour.Tour;
import com.example.be.dto.tour.TourImg;
import com.example.be.mapper.tour.TourMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class TourService {
  final TourMapper mapper;
  final S3Client s3;

  @Value("${image.src.prefix}")
  String imageSrcPrefix;

  @Value("${bucket.name}")
  String bucketName;

  public boolean add(Tour tour, MultipartFile[] files, Authentication authentication) {
    String nickname = mapper.findNickname(authentication.getName());
    tour.setPartner(nickname);

    int cnt = mapper.insert(tour);

    if (files != null && files.length > 0) {
      //file upload
      for (MultipartFile file : files) {
        String objectKey = "teamPrj1126/" + tour.getId() + "/" + file.getOriginalFilename();
        PutObjectRequest por = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        try {
          s3.putObject(por, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (IOException e) {
          throw new RuntimeException(e.getMessage(), e);
        }

        //board_file테이블에 등록
        mapper.insertFile(tour.getId(), file.getOriginalFilename());
      }
    }
    return cnt == 1;
  }

  public Tour get(int id) {
    Tour tour = mapper.selectById(id);
    List<String> fileNameList = mapper.selectFilesByTourId(id);

    List<TourImg> fileSrcList = fileNameList.stream()
            .map(name -> new TourImg(name, imageSrcPrefix + "/" + id + "/" + name))
            .toList();

    tour.setFileList(fileSrcList);
    return tour;
  }

  public Map<String, Object> list(String searchType, String keyword) {
    List<Tour> tourList = mapper.selectAll(searchType, keyword);
    if (tourList == null || tourList.isEmpty()) {
      return Map.of("tourList", List.of()); // 빈 리스트 반환
    }
    return Map.of("tourList", tourList);
  }

  public boolean validate(Tour tour) {
    boolean title = tour.getTitle().trim().length() > 0;
    boolean product = tour.getProduct().trim().length() > 0;
    boolean priceValid = false;
    try {
      // price가 null이 아니면서 0보다 크거나 같은지 확인
      if (tour.getPrice() != null) {
        priceValid = tour.getPrice() >= 0;
      }
    } catch (Exception e) {
      priceValid = false; // 예외 발생 시 유효하지 않은 가격으로 처리
    }
    return title && product && priceValid;
  }

  public boolean delete(int id) {
    int cnt = mapper.deleteById(id);
    return cnt == 1;
  }

  public boolean update(Tour tour) {
    int cnt = mapper.update(tour);
    return cnt == 1;
  }
}
