package com.example.be.service.tour;

import com.example.be.dto.tour.PaymentHistory;
import com.example.be.dto.tour.Review;
import com.example.be.dto.tour.TourImg;
import com.example.be.mapper.member.MemberMapper;
import com.example.be.mapper.tour.ReviewMapper;
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
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {
    final ReviewMapper mapper;
    final MemberMapper memberMapper;
    final S3Client s3;

    @Value("${image.src.prefix}")
    String imageSrcPrefix;

    @Value("${bucket.name}")
    String bucketName;

    public boolean add(Review review, Authentication auth, MultipartFile[] reviewImg) {
        review.setWriterEmail(auth.getName());
        review.setWriterNickname(memberMapper.selectNicknameByEmail(auth.getName()));
//    System.out.println("작성 정보" + review);
        int cnt = mapper.insert(review);

        if (reviewImg != null && reviewImg.length > 0) {
            for (MultipartFile file : reviewImg) {
                String objectKey = "teamPrj1126/" + review.getTourId() + "/review/" + review.getReviewId() + "/" + file.getOriginalFilename();
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

                mapper.insertFile(review.getReviewId(), file.getOriginalFilename());
            }
        }

        return cnt == 1;
    }

    public List<Review> list(Integer tourId) {
//        List<Review> reviewList = mapper.selectReviewByTourId(tourId);
        List<Integer> reviews = mapper.selectReviewIdByTourId(tourId);

        List<Review> reviewList = new ArrayList<>();

        for (int reviewId : reviews) {
            Review review = get(reviewId);
            reviewList.add(review);
        }

        System.out.println(reviewList);
        return reviewList;
    }

    public Boolean delete(Integer reviewId) {
        //첨부파일 삭제
        List<String> imageName = mapper.selectImagesByReviewId(reviewId);
        Integer tourId = mapper.selectTourByReview(reviewId);
        for (String image : imageName) {
            String key = "teamPrj1126/" + tourId + "/review/" + reviewId + "/" + image;
            DeleteObjectRequest dor = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
            s3.deleteObject(dor);
        }

        //DB tour_review_img 삭제
        mapper.deleteImageByReviewId(reviewId);

        int cnt = mapper.deleteByReviewId(reviewId);

        return cnt == 1;
    }

    public boolean edit(Review review, List<String> removeFiles, MultipartFile[] uploadFiles) {
        System.out.println("review 추적" + review);
        
        //삭제 파일
        if (removeFiles != null) {
            for (String file : removeFiles) {
                String key = "teamPrj1126/" + review.getTourId() + "/review/" + review.getReviewId() + "/" + file;
                DeleteObjectRequest dor = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
                s3.deleteObject(dor);
                mapper.deleteImageByReviewIdAndName(review.getReviewId(), file);
            }
        }

        //추가 파일
        if (uploadFiles != null && uploadFiles.length > 0) {
            for (MultipartFile file : uploadFiles) {
                System.out.println(file.getOriginalFilename());
                String objectKey = "teamPrj1126/" + review.getTourId() + "/review/" + review.getReviewId() + "/" + file.getOriginalFilename();
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
                mapper.insertFile(review.getReviewId(), file.getOriginalFilename());
            }
        }

        int cnt = mapper.update(review);
        return cnt == 1;
    }

    public boolean canWriteReview(Integer tourId, Authentication auth) {
        //1. 구매 횟수가 0이 아닐 것
        int purchaseCount = mapper.purchaseHistory(tourId, auth.getName());

        if (purchaseCount != 0) {
            //2. 구매 회수가 작성 이력보다 클 것
            return purchaseCount > mapper.reviewCount(tourId, auth.getName());
        } else {
            return false;
        }
    }

    public List<PaymentHistory> paymentList(Integer tourId, Authentication auth) {
        return mapper.paymentList(tourId, auth.getName());
    }

    public Review get(int reviewId) {
        Review review = mapper.selectByReviewId(reviewId);
        List<String> imageNames = mapper.selectImagesByReviewId(reviewId);
        List<TourImg> imageSrcList = imageNames.stream()
            .map(name -> new TourImg(reviewId, name, imageSrcPrefix + "/" + review.getTourId() + "/review/" + reviewId + "/" + name))
            .toList();
        review.setImageList(imageSrcList);

        return review;
    }
}
