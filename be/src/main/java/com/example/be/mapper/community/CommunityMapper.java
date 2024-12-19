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
                        <script>
                        SELECT COUNT(*)
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
                </script>
            """)
    Integer countAllCommunity(String searchType, String searchKeyword);

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
            SELECT id
            FROM community_file
            WHERE community_id = #{id}
            ORDER BY id ASC
            """)
    List<Integer> callCommunityFile(Integer id);

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
            WHERE id=#{fileNumber}
            """)
    int deleteFileByFileNumber(Integer fileNumber);

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

    @Select("""
            SELECT file_name
            FROM community_file
            WHERE id=#{fileNumber}
            """)
    String findFileNameByFileNumber(Integer fileNumber);

    @Select("""
            SELECT c.id id, c.title title, c.inserted creationDate
            FROM community c JOIN member m ON c.writer=m.nickname
            WHERE m.email=#{email}
            ORDER BY creationDate DESC
            """)
    List<Map<String, Object>> wholeListUp(String email);

    @Select("""
            SELECT COUNT(*)
            FROM community_like
            WHERE community_id=#{id}
            """)
    Integer countLikesByCommunityId(Integer id);

    @Delete("""
            DELETE FROM community_like
            WHERE community_id=#{id}
            """)
    int deleteLikeByCommunityId(Integer id);

    // 메인 화면에 필요한 일부 community 리스트 가져오기
    @Select("""
            <script>
            SELECT *
            FROM community
            WHERE 
                <trim prefixOverrides="OR">
                    title LIKE CONCAT('%', #{keyword}, '%')
                    OR content LIKE CONCAT('%', #{keyword}, '%')
                    OR writer LIKE CONCAT('%', #{keyword}, '%')
                </trim>
            ORDER BY inserted DESC
            LIMIT 5
            </script>
            """)
    List<Community> getTop5ByOrderByUpdated(String keyword);

    @Select("""
            SELECT id
            FROM community
            WHERE writer=#{nickname}
            """)
    List<Integer> selectWholeCommunityIdByWriter(String nickname);

    @Select("""
            SELECT id
            FROM community_comment
            WHERE writer=#{nickname}
            """)
    List<Integer> selectWholeCommunityCommentIdByWriter(String nickname);

    @Select("""
            SELECT community_id communityId
            FROM community_like
            WHERE person=#{nickname}
            """)
    List<Integer> selectWholeCommunityLikeByNickName(String nickname);

    @Delete("""
            DELETE FROM community_like
            WHERE community_id=#{likeCommunityId} AND person=#{likeUser}
            """)
    int deleteLikeByInformation(Integer likeCommunityId, String likeUser);

    @Select("""
            SELECT writer
            FROM community
            WHERE id=#{id}
            """)
    String findNicknameByCommunityId(Integer id);

    @Select("""
            SELECT writer
            FROM community_comment
            WHERE id=#{id}
            """)
    String findNicknameByCommunityCommentId(Integer id);

    @Insert("""
            INSERT INTO community_like (community_id, person)
            VALUES (#{id}, #{person})
            """)
    int InputLikeInCommunity(Integer id, String person);

    @Select("""
            SELECT COUNT(*)
            FROM community_like
            WHERE community_id=#{id} AND person=#{person}
            """)
    int findLikeByIdAndNickname(Integer id, String person);

    @Delete("""
            DELETE FROM community_like
            WHERE community_id=#{id} AND person=#{person}
            """)
    int deleteLikeInCommunity(Integer id, String person);


    @Select("""
            SELECT views
            FROM community
            WHERE id=#{id}
            """)
    int checkViews(Integer id);

    @Update("""
            UPDATE community
            SET views=#{plusViews}
            WHERE id=#{id}
            """)
    int updateViews(Integer plusViews, Integer id);

    @Select("""
            SELECT *
            FROM community
            WHERE id=#{id};
            """)
    Community communityInformation(Integer id);
}
