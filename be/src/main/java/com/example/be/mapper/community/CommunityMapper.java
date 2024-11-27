package com.example.be.mapper.community;

import com.example.be.dto.community.Community;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface CommunityMapper {

    @Select("""
            SELECT id, title, writer, inserted
            FROM community
            ORDER BY id DESC
            """)
    List<Map<String, Object>> listUp(Integer page);

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

    @Delete("""
            DELETE FROM community
            WHERE id = #{id}
            """)
    int deleteCommunity(Integer id);

    // TODO : SQL 이름 합의 후 적용하기
}
