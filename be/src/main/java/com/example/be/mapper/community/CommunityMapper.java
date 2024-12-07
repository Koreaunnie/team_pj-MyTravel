package com.example.be.mapper.community;

import com.example.be.dto.community.Community;
import com.example.be.dto.community.CommunityComment;
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
                                <if test="searchType == 'all'">
                                    title LIKE CONCAT('%',#{searchKeyword},'%')
                                 OR writer LIKE CONCAT('%',#{searchKeyword},'%')
                                 OR content LIKE CONCAT('%',#{searchKeyword},'%')
                                </if>
                                <if test="searchType != 'all'">
                                     <choose>
                                         <when test="searchType == 'title'">
                                             title LIKE CONCAT('%', #{searchKeyword}, '%')
                                         </when>
                                         <when test="searchType == 'writer'">
                                             writer LIKE CONCAT('%', #{searchKeyword}, '%')
                                         </when>
                                         <when test="searchType == 'content'">
                                             content LIKE CONCAT('%', #{searchKeyword}, '%')
                                         </when>
                                         <otherwise>
                                             1 = 0 
            <!-- 허용되지 않은 searchType이면 빈 결과 반환 -->
                                         </otherwise>
                                     </choose>
                                 </if>
                        ORDER BY id DESC
                        LIMIT #{pageList}, 10
                        </script>
            """)
    List<Map<String, Object>> listUp(Integer pageList, String searchType, String searchKeyword);

    @Select("""
            SELECT id, title, content, writer, inserted creationDate
            FROM community
            WHERE id = #{id}
            """)
    Map<String, Object> viewCommunity(Integer id);

    @Select("""
            SELECT file_name
            FROM community_file
            WHERE community_id = #{id}
            ORDER BY id ASC
            """)
    List<String> callCommunityFile(Integer id);

    @Select("""
            SELECT nickname
            FROM member
            WHERE email = #{email}
            """)
    String findNickname(String email);

    @Insert("""
            INSERT INTO community (title, content, writer)
            VALUES (#{title}, #{content}, #{writer})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int writeCommunity(Community community);

    @Insert("""
            INSERT INTO community_file (file_name, community_id)
            VALUES (#{filesName}, #{id})
            """)
    int addFile(String filesName, Integer id);


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

    @Insert("""
            INSERT INTO community_file (comment, writer, community_id)
            Values (#{comment}, #{writer}, #{communityId})
            """)
    int writeCommunityComment(CommunityComment comment);
}
