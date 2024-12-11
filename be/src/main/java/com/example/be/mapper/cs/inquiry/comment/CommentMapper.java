package com.example.be.mapper.cs.inquiry.comment;

import com.example.be.dto.cs.inquiry.comment.Comment;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

@Mapper
public interface CommentMapper {
    @Insert("""
            INSERT INTO comment
            (inquiry_id, member_email, member_nickname, comment, inserted)
            VALUES (#{inquiryId}, #{memberEmail}, #{memberNickname}, #{comment}, NOW())
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    void insert(Comment comment);
}
