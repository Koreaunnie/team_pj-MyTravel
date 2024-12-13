package com.example.be.mapper.tour;

import com.example.be.dto.tour.Review;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ReviewMapper {
  @Insert("""
          INSERT INTO tour_review
          (tour_id, writer_email, writer_nickname, review) 
          VALUES (#{tourId}, #{writerEmail}, #{writerNickname}, #{review}) 
          """)
  @Options(keyProperty = "reviewId", useGeneratedKeys = true)
  int insert(Review review);

  @Select("""
          SELECT *
          FROM tour_review
          WHERE tour_id=#{tourId}
          ORDER BY review_id DESC
          """)
  List<Review> selectReviewByTourId(Integer tourId);

  @Delete("""
          DELETE FROM tour_review
          WHERE review_id=#{reviewId}
          """)
  int deleteByReviewId(Integer reviewId);

  @Update("""
          UPDATE tour_review
          SET review=#{review}
          WHERE review_id=#{reviewId}
          """)
  int update(Review review);

  @Select("""
          SELECT COUNT(*) 
           FROM payment_detail pd LEFT JOIN payment p ON pd.payment_id=p.payment_id 
          WHERE p.buyer_email=#{name}
            AND pd.tour_id=#{tourId}
          """)
  int purchaseHistory(Integer tourId, String name);

  @Select("""
          SELECT COUNT(*)
          FROM tour_review
          WHERE tour_id=#{tourId}
            AND writer_email=#{name}
          """)
  int reviewCount(Integer tourId, String name);
}
