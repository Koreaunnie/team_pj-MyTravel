package com.example.be.service.tour;

import com.example.be.dto.tour.Cart;
import com.example.be.dto.tour.Tour;
import com.example.be.dto.tour.TourImg;
import com.example.be.dto.tour.TourList;
import com.example.be.mapper.tour.TourMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
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
        tour.setPartnerEmail(authentication.getName());

        int cnt = mapper.insert(tour);

        //업로드할 파일이 있다면
        if (files != null && files.length > 0) {
            //s3 file upload
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
//        System.out.println(tour);

        List<TourImg> fileSrcList = fileNameList.stream()
            .map(name -> new TourImg(id, name, imageSrcPrefix + "/" + id + "/" + name))
            .toList();

        tour.setFileList(fileSrcList);
        return tour;
    }

    public Map<String, Object> list(Integer page, String searchType, String keyword) {

        int offset = (page - 1) * 12;

        //리스트 조회
        List<TourList> tourList = mapper.selectAll(offset, searchType, keyword);
//        System.out.println("투어리스트" + tourList);

        //전체 게시물
        Integer count = mapper.countAll(searchType, keyword);
//        System.out.println("전체 개수 " + count);

        if (tourList == null || tourList.isEmpty()) {
            return Map.of("tourList", List.of()); // 빈 리스트 반환
        }

        tourList.stream()
            .forEach(tour -> {
                if (tour.getImage() != null) {
                    tour.setSrc(imageSrcPrefix + "/" + tour.getId() + "/" + tour.getImage());
                }
            });
        return Map.of("tourList", tourList, "count", count);
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
        //삭제 선택 시 데이터 삭제가 아닌 active 컬럼 false로 변경
//    //첨부파일 삭제
//    List<String> fileName = mapper.selectFilesByTourId(id);
//    for (String file : fileName) {
//      String key = "teamPrj1126/" + id + "/" + file;
//      DeleteObjectRequest dor = DeleteObjectRequest.builder()
//              .bucket(bucketName)
//              .key(key)
//              .build();
//      s3.deleteObject(dor);
//    }
//
//    //DB테이블에서 삭제
//    mapper.deleteFileByTourId(id);

        //장바구니 저장 내용 삭제
        mapper.deleteCartByTourId(id);

//    int cnt = mapper.deleteById(id);
        int cnt = mapper.updateActiveToFalse(id);

        return cnt == 1;
    }

    public boolean update(Tour tour, List<String> removeFiles, MultipartFile[] uploadFiles) {
        if (removeFiles != null) { //파일 유무
            for (String file : removeFiles) { //파일 삭제
                String key = "teamPrj1126/" + tour.getId() + "/" + file;
                DeleteObjectRequest dor = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
                s3.deleteObject(dor);
                mapper.deleteFileByTourIdAndName(tour.getId(), file);
            }
        }

        if (uploadFiles != null && uploadFiles.length > 0) {
            for (MultipartFile file : uploadFiles) {
                String objectKey = "teamPrj1126/" + tour.getId() + "/" + file.getOriginalFilename();
                PutObjectRequest por = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();
                try {
                    s3.putObject(por, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                mapper.insertFile(tour.getId(), file.getOriginalFilename());
            }
        }

        int cnt = mapper.update(tour);
        return cnt == 1;
    }

    public boolean addCart(Tour tour, Cart cart, Authentication authentication) {
        tour.setPartnerEmail(authentication.getName());

        boolean exists = mapper.checkCart(tour.getId(), tour.getPartnerEmail());
        if (exists) {
            return false;
        }

        int cnt = mapper.addCart(tour.getId(), tour.getPartnerEmail(), cart.getStartDate(), cart.getEndDate());
        return cnt == 1;
    }

    public boolean hasAccess(int id, Authentication authentication) {
        Tour tour = mapper.selectById(id);

        return tour.getPartnerEmail().equals(authentication.getName());
    }

    // 메인 화면에 필요한 일부 tour 리스트 가져오기
    public List<TourList> getMainPageTours(String keyword) {
        // DB에서 투어 리스트 가져오기
        List<TourList> tours = mapper.getTop4ByOrderById(keyword);

        // 각 투어 객체의 이미지 경로 설정
        if (tours != null && !tours.isEmpty()) {
            tours.stream().forEach(tour -> {
                if (tour.getImage() != null) {
                    // 이미지 경로 설정
                    tour.setSrc(imageSrcPrefix + "/" + tour.getId() + "/" + tour.getImage());
                }
            });
        }
        return tours;
    }


    public List<Tour> myList(String email) {
        return mapper.myList(email);
    }
}
