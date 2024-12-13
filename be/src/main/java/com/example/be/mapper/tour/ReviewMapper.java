package com.example.be.mapper.tour;

import com.example.be.dto.tour.Review;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

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
}
