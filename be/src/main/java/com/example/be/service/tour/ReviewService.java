package com.example.be.service.tour;

import com.example.be.dto.tour.PaymentHistory;
import com.example.be.dto.tour.Review;
import com.example.be.mapper.member.MemberMapper;
import com.example.be.mapper.tour.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {
  final ReviewMapper mapper;
  final MemberMapper memberMapper;

  public boolean add(Review review, Authentication auth) {
    review.setWriterEmail(auth.getName());
    review.setWriterNickname(memberMapper.selectNicknameByEmail(auth.getName()));
    System.out.println("작성 정보" + review);
    int cnt = mapper.insert(review);
    return cnt == 1;
  }

  public List<Review> list(Integer tourId) {
    return mapper.selectReviewByTourId(tourId);
  }

  public void delete(Integer reviewId) {
    mapper.deleteByReviewId(reviewId);
  }

  public boolean edit(Review review) {
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
}
