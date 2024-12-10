package com.example.be.mapper.cs.faq;

import com.example.be.dto.cs.faq.Faq;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface FaqMapper {

    @Insert("""
            INSERT INTO faq
                (question, answer, writer)
            VALUES (#{question}, #{answer}, #{writer})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insertFaq(Faq faq);

    @Select("""
            SELECT *
            FROM faq
            ORDER BY updated DESC
            """)
    List<Faq> selectAll();

    @Select("""
            SELECT *
            FROM faq
            WHERE id = #{id}
            """)
    Faq selectById(int id);

    @Update("""
            UPDATE faq 
            SET question = #{question}, 
                answer = #{answer},
                updated = NOW()
            WHERE id = #{id}
            """)
    int updateById(Faq faq);

    @Delete("""
            DELETE FROM faq
            WHERE id = #{id}
            """)
    int deleteById(int id);

    @Select("""
            SELECT *
            FROM faq
            ORDER BY updated DESC
            LIMIT 5
            """)
    List<Faq> selectFaqForIndex();
}
