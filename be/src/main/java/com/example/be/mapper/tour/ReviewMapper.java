package com.example.be.mapper.tour;

import com.example.be.dto.tour.PaymentHistory;
import com.example.be.dto.tour.Review;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ReviewMapper {
    @Insert("""
        INSERT INTO tour_review
        (tour_id, writer_email, writer_nickname, review, payment_id, rating) 
        VALUES (#{tourId}, #{writerEmail}, #{writerNickname}, #{review}, #{paymentId}, #{rating}) 
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
        SET review=#{review}, rating=#{rating}
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

    @Select("""
        SELECT p.payment_id, paid_at, pd.tour_id, startDate, endDate, review
        FROM payment p 
            RIGHT JOIN payment_detail pd ON p.payment_id=pd.payment_id
            LEFT JOIN tour ON tour.id=pd.tour_id    
            LEFT JOIN tour_review tr ON tr.payment_id = p.payment_id AND tr.tour_id = tour.id
        WHERE buyer_email = #{email}
          AND pd.tour_id = #{tourId}
          AND review IS NULL    
        ORDER BY paid_at DESC;    
        """)
    List<PaymentHistory> paymentList(Integer tourId, String email);

    @Insert("""
        INSERT INTO tour_review_img
        VALUES (#{reviewId}, #{fileName})
        """)
    int insertFile(Integer reviewId, String fileName);

    @Select("""
        SELECT *
        FROM tour_review
        WHERE review_id=#{reviewId}
        """)
    Review selectByReviewId(int reviewId);

    @Select("""
        SELECT name
        FROM tour_review_img
        WHERE review_id=#{reviewId}
        """)
    List<String> selectImagesByReviewId(int reviewId);

    @Select("""
        SELECT review_id
        FROM tour_review
        WHERE tour_id=#{tourId}
        ORDER BY review_id DESC
        """)
    List<Integer> selectReviewIdByTourId(Integer tourId);

    @Select("""
        SELECT tour_id
        FROM tour_review
        WHERE review_id=#{reviewId}
        """)
    Integer selectTourByReview(Integer reviewId);

    @Delete("""
        DELETE FROM tour_review_img
        WHERE review_id=#{reviewId}
        """)
    int deleteImageByReviewId(Integer reviewId);

    @Delete("""
        DELETE FROM tour_review_img
        WHERE review_id=#{reviewId}
        AND name=#{file}
        """)
    int deleteImageByReviewIdAndName(Integer reviewId, String file);
}
