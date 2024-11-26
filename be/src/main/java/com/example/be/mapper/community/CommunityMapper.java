package com.example.be.mapper.community;

import com.example.be.dto.Community;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CommunityMapper {

    @Select("""
            SELECT title, writer, inserted
            FROM community
            ORDER BY id DESC
            """)
    int listUp(Integer page);

    @Insert("""
            INSERT INTO community (title, content, writer)
            VALUES (#{title}, #{content}, #{writer})
            """)
    List<String> writeCommunity(Community community);

    @Select("""
            SELECT *
            FROM community
            WHERE id = #{id}
            """)
    int viewCommunity(Integer id);

    // TODO : SQL 이름 합의 후 적용하기
}
