package com.example.be.mapper.community;

import com.example.be.dto.Community;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

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
    int writeCommunity(Community community);

    @Select("""
            SELECT *
            FROM community
            WHERE id = #{id}
            """)
    int viewCommunity(Integer id);

    @Update("""
            UPDATE community
            SET title = #{title}, content = #{content}
            WHERE id=#{id}
            """)
    int editCommunity(Community community);

    // TODO : SQL 이름 합의 후 적용하기
}
