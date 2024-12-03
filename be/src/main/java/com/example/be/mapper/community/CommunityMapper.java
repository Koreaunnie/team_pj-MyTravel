package com.example.be.mapper.community;

import com.example.be.dto.community.Community;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface CommunityMapper {

    @Select("""
                        <script>
                        SELECT id, title, writer, inserted
                        FROM community
                        WHERE 
                            <trim prefixOverrides='OR'>
                                <if test="searchType == 'content' || searchType == 'all'">
                                    content LIKE CONCAT('%',#{searchKeyword},'%')
                                </if>
                                <if test="searchType == 'writer' || searchType == 'all'">
            
                                   OR writer LIKE CONCAT('%',#{searchKeyword},'%')
                                </if>
                                <if test="searchType == 'title' || searchType == 'all'">
                                   OR title LIKE CONCAT('%',#{searchKeyword},'%')
                                </if>
                            </trim>
                        ORDER BY id DESC
                        LIMIT #{pageList}, 10
                        </script>
            """)
    List<Map<String, Object>> listUp(Integer pageList, String searchType, String searchKeyword);

    @Insert("""
            INSERT INTO community (title, content, writer)
            VALUES (#{title}, #{content}, #{writer})
            """)
    int writeCommunity(Community community);

    @Select("""
            SELECT id, title, content, writer, inserted creationDate
            FROM community
            WHERE id = #{id}
            """)
    Map<String, Object> viewCommunity(Integer id);

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

    @Select("""
            SELECT nickname
            FROM member
            WHERE email = #{email}
            """)
    String findNickname(String email);

}
