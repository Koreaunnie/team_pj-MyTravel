package com.example.be.mapper.cs.faq;

import com.example.be.dto.cs.faq.Faq;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

@Mapper
public interface FaqMapper {

    @Insert("""
            INSERT INTO faq
                (question, answer)
            VALUES (#{question}, #{answer})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insertFaq(Faq faq);
}
