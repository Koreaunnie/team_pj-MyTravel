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
                        SELECT id, title, writer, inserted creationDate
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
                        LIMIT #{pageList},10    
                        </script>
            """)
    List<Community> listUp(Integer pageList, String searchType, String searchKeyword);

    @Select("""
            SELECT COUNT(*)
            FROM community
            """)
    Integer countAllCommunity();

    @Select("""
            SELECT COUNT(*)
            FROM community_file
            WHERE community_id=#{id}
            """)
    int countFilesByCommunityId(Integer id);

    @Select("""
            SELECT id, title, content, writer, inserted creationDate
            FROM community
            WHERE id = #{id}
            """)
    Map<String, Object> viewCommunity(Integer id);

    @Select("""
            SELECT file_name
            FROM community_file
            WHERE community_id=#{id}
            """)
    List<String> selectFilesByCommunityId(int id);

    @Select("""
            SELECT file_name
            FROM community_file
            WHERE community_id = #{id}
            ORDER BY id ASC
            """)
    List<String> callCommunityFile(Integer id);

    @Select("""
            SELECT COUNT(*)
            FROM community_comment
            WHERE community_id=#{id}
            """)
    int countCommentsByCommunityId(Integer id);

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
            INSERT INTO community_comment (comment, writer, community_id)
            VALUES (#{comment}, #{writer}, #{communityId})
            """)
    int writeCommunityComment(CommunityComment communityComment);

    @Select("""
            SELECT *
            FROM community
            WHERE id=#{id}
            """)
    Community selectByCommunityId(int id);


    @Delete("""
            DELETE FROM community_file
            WHERE community_id=#{id}
            """)
    int deleteFileByCommunityId(int id);


    @Delete("""
            DELETE FROM community_file
            WHERE community_id=#{id} AND file_name=#{removeFile}
            """)
    int deleteFileByFileName(Integer id, String removeFiles);

    @Select("""
            SELECT id, comment, writer , inserted creationDate
            FROM community_comment
            WHERE community_id=#{id}
            ORDER BY creationDate ASC
            """)
    List<Map<String, Object>> callCommunityComment(Integer id);

    @Delete("""
            DELETE FROM community_comment
            WHERE id = #{id}
            """)
    int deleteCommentByCommentId(Integer id);

    @Delete("""
            DELETE FROM community_comment
            WHERE community_id=#{id}
            """)
    int deleteCommentByCommunityId(Integer id);


    @Update("""
            UPDATE community_comment
            SET comment=#{comment}
            WHERE id=#{id}
            """)
    int updateCommunityComment(String comment, Integer id);

    @Select("""
            SELECT nickname
            FROM member
            WHERE email = #{email}
            """)
    String findNickname(String email);

//    @Select("""
//            SELECT views
//            FROM community
//            WHERE id=#{id}
//            """)
//    Integer checkViews(Integer id);
//
//    @Update("""
//            UPDATE community
//            SET views=#{plusViews}
//            WHERE id=#{id}
//            """)
//    int updateViews(Integer plusViews, Integer id);
}
