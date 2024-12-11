package com.example.be.mapper.cs.inquiry.comment;

import com.example.be.dto.cs.inquiry.comment.Comment;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CommentMapper {
    @Insert("""
            INSERT INTO comment
            (inquiry_id, member_email, member_nickname, comment, inserted)
            VALUES (#{inquiryId}, #{memberEmail}, #{memberNickname}, #{comment}, NOW())
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insert(Comment comment);

    @Select("""
            SELECT *
            FROM comment
            WHERE inquiry_id = #{inquiryId}
            ORDER BY updated, inserted
            """)
    List<Comment> selectAll(Integer inquiryId);
}
