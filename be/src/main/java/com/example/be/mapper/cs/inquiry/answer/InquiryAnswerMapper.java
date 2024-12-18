package com.example.be.mapper.cs.inquiry.answer;

import com.example.be.dto.cs.inquiry.answer.InquiryAnswer;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface InquiryAnswerMapper {
    @Insert("""
            INSERT INTO inquiry_answer
            (inquiry_id, member_email, member_nickname, answer, inserted)
            VALUES (#{inquiryId}, #{memberEmail}, #{memberNickname}, #{answer}, NOW())
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insert(InquiryAnswer inquiryAnswer);

    @Select("""
            SELECT *
            FROM inquiry_answer
            WHERE inquiry_id = #{inquiryId}
            ORDER BY inserted
            """)
    List<InquiryAnswer> selectAll(Integer inquiryId);

    @Update("""
            UPDATE inquiry_answer 
            SET inquiryAnswer = #{inquiryAnswer},
                updated = NOW()
            WHERE id = #{id}
            """)
    int updateById(InquiryAnswer inquiryAnswer);

    @Delete("""
            DELETE FROM inquiry_answer
            WHERE id = #{id}
            """)
    int deleteById(int id);
}
