package com.example.be.mapper.cs.faq;

import com.example.be.dto.cs.faq.Faq;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface FaqMapper {

    @Insert("""
            INSERT INTO faq
                (question, answer)
            VALUES (#{question}, #{answer})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insertFaq(Faq faq);

    @Select("""
            SELECT *
            FROM faq
            ORDER BY updated DESC
            """)
    List<Faq> selectAll();
}
