package com.example.be.mapper.cs;

import com.example.be.dto.cs.inquiry.Inquiry;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

@Mapper
public interface CsMapper {

    @Insert("""
            INSERT INTO inquiry
                (category, writer, title, content, secret)
            VALUES (#{category}, #{writer}, #{title}, #{content}, #{secret})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insertInquiry(Inquiry inquiry);
}
