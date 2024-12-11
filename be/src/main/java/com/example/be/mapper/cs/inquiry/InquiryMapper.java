package com.example.be.mapper.cs.inquiry;

import com.example.be.dto.cs.inquiry.Inquiry;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface InquiryMapper {

    @Insert("""
            INSERT INTO inquiry
                (category, writer, writer_nickname, title, content, secret, inserted)
            VALUES (#{category}, #{writer}, #{writerNickname}, #{title}, #{content}, #{secret}, NOW())
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insertInquiry(Inquiry inquiry);

    @Select("""
            SELECT *
            FROM inquiry
            ORDER BY updated DESC
            """)
    List<Inquiry> selectAll();

    @Select("""
            SELECT *
            FROM inquiry
            WHERE id = #{id}
            """)
    Inquiry selectById(int id);

    @Update("""
            update inquiry
            SET category = #{category},
                title = #{title},
                content = #{content},
                secret = #{secret},
                updated = NOW()
            WHERE id = #{id} AND writer = #{writer}
            """)
    int updateById(Inquiry inquiry);

    @Delete("""
            DELETE FROM inquiry
            WHERE id = #{id} AND writer = #{writer}
            """)
    int deleteById(int id, String writer);

    @Select("""
            SELECT *
            FROM inquiry
            ORDER BY updated DESC
            LIMIT 5
            """)
    List<Inquiry> selectInquiryForIndex();

    // 회원 닉네임 변경 시 문의글 닉네임도 변경
    @Update("""
            UPDATE inquiry 
                SET writer_nickname = #{writerNickname}
            WHERE writer = #{writer}
            """)
    int updateWriterNickname(Inquiry inquiry);
}
