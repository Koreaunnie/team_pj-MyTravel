package com.example.be.mapper.cs.inquiry;

import com.example.be.dto.cs.inquiry.Inquiry;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface InquiryMapper {

    @Insert("""
        INSERT INTO inquiry
            (category, writer, writer_nickname, title, content, secret, inserted, has_answer)
        VALUES (#{category}, #{writer}, #{writerNickname}, #{title}, #{content}, #{secret}, NOW(), false)
        """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insertInquiry(Inquiry inquiry);

    @Select("""
        <script>
        SELECT *
        FROM inquiry
        WHERE
            <trim prefixOverrides="OR">
                <if test="searchType == 'all' or searchType == 'title'">
                    title LIKE CONCAT('%', #{searchKeyword}, '%')
                </if>
                <if test="searchType == 'all' or searchType == 'content'">
                        OR content LIKE CONCAT('%', #{searchKeyword}, '%')
                </if>
                <if test="searchType == 'all' or searchType == 'writer'">
                        OR writer_nickname LIKE CONCAT('%', #{searchKeyword}, '%')
                </if>
            </trim>
        ORDER BY updated DESC, inserted DESC
        LIMIT #{offset}, 10;
        </script>
        """)
    List<Inquiry> selectInquiryByPageOffset(Integer offset, String searchType, String searchKeyword);

    @Select("""
        <script>
        SELECT COUNT(*)
        FROM inquiry
        WHERE
            <trim prefixOverrides="OR">
                <if test="searchType == 'all' or searchType == 'title'">
                    title LIKE CONCAT('%', #{searchKeyword}, '%')
                </if>
                <if test="searchType == 'all' or searchType == 'content'">
                    OR content LIKE CONCAT('%', #{searchKeyword}, '%')
                </if>
                <if test="searchType == 'all' or searchType == 'writer'">
                     OR writer_nickname LIKE CONCAT('%', #{searchKeyword}, '%')
                </if>
            </trim>
        </script>
        """)
    Integer countAll(String searchType, String searchKeyword);

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
        WHERE id = #{id}
        """)
    int deleteById(int id);

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

    // 문의글 답변 달리면 답변 여부 업데이트
    @Update("""
        UPDATE inquiry
            SET has_answer = true
        WHERE id =#{id}
        """)
    int updateHasAnswerTrue(int id);
}
