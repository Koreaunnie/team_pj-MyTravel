package com.example.be.service.tour;

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

    int cnt = mapper.insert(review);
    return cnt == 1;
  }

  public List<Review> list(Integer tourId) {
    return mapper.selectReviewByTourId(tourId);
  }
}
