package com.example.be.mapper.member;

import com.example.be.dto.member.Member;
import com.example.be.dto.member.MemberEdit;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MemberMapper {

    @Insert("""
        INSERT INTO member 
        (email, nickname, password, name, phone)
        VALUES (#{email}, #{nickname}, #{password}, #{name}, #{phone})
        """)
    int insert(Member member);

    @Select("""
        SELECT * FROM member
        WHERE email = #{email}""")
    Member selectByEmail(String email);

    @Select("""
        SELECT email, nickname, inserted
        FROM member
        ORDER BY inserted""")
    List<Member> selectAll();

    @Delete("""
        DELETE FROM member
        WHERE email = #{email}    
        """)
    int deleteByEmail(String email);

    @Update("""
        UPDATE member
           SET nickname = #{nickname}, 
               password = #{password},
               phone = #{phone}      
         WHERE email=#{email}
        """)
    int update(MemberEdit member);

    @Select("""
        SELECT *
        FROM member
        WHERE nickname = #{nickname}
        """)
    Member selectByNickname(String nickname);

    @Select("""
        SELECT picture
        FROM member
        WHERE email=#{email}""")
    String selectPictureByEmail(String email);

    @Update("""
        UPDATE member
        SET picture = #{filename}
        WHERE email=#{email}
        """)
    int updatePicture(String email, String filename);

    @Delete("""
        DELETE FROM tour_cart
        WHERE member_email=#{email}
        """)
    int deleteCartByMemberEmail(String email);

    @Select("""
        SELECT auth
        FROM auth
        WHERE member_email=#{email}
        """)
    List<String> selectAuthByMemberEmail(String email);

    @Update("""
        UPDATE tour
        SET partner = '탈퇴한 회원',
            partnerEmail = 'left'
        WHERE id = #{tourId};
        """)
    int updatePartnerToLeft(Integer tourId);

    @Update("""
        UPDATE community
        SET writer = '탈퇴한 회원'
        WHERE id = #{communityId}
        """)
    int updateWriterToLeft(Integer communityId);

    @Update("""
        UPDATE community_comment
        SET writer = '탈퇴한 회원'
        WHERE id = #{communityCommentId}
        """)
    int updateCommentWriterToLeft(Integer communityCommentId);

    @Delete("""
        DELETE FROM auth
        WHERE member_email=#{email}""")
    int deleteAuthByEmail(String email);

    @Select("""
        SELECT *
        FROM member m
        RIGHT JOIN auth ON m.email = auth.member_email
        WHERE auth.auth='partner';
        """)
    List<Member> partnerList();

    @Select("""
        SELECT nickname
        FROM member
        WHERE email = #{email}
        """)
    String selectNicknameByEmail(String email);

    @Select("""
        SELECT COUNT(*) FROM member
        WHERE email=#{kakaoId};      
        """)
    int checkKakaoAccount(String kakaoId);

    @Update("""
        UPDATE member
        SET kakao=TRUE
        WHERE email=#{email}""")
    int setAsKakaoAccount(String email);

    @Update("""
        UPDATE tour_review
        SET writer_email='left',
            writer_nickname='탈퇴한 회원'
        WHERE review_id=#{reviewId}
        """)
    int updateEmailToLeft(Integer reviewId);

    @Select("""
        <script>
        SELECT *
        FROM member
        WHERE 
            <trim prefixOverrides="OR">
                <if test="searchType=='all' or searchType=='email'">
                    email LIKE CONCAT('%', #{keyword}, '%')
                </if>            
                <if test="searchType == 'all' or searchType == 'nickname'">
                    OR nickname LIKE CONCAT('%', #{keyword}, '%')
                </if>
                <if test="searchType == 'all' or searchType == 'name'">
                    OR name LIKE CONCAT('%', #{keyword}, '%')
                </if>
                <if test="searchType == 'all' or searchType == 'phone'">
                    OR phone LIKE CONCAT('%', #{keyword}, '%')
                </if>        
            </trim>
        ORDER BY inserted DESC
        LIMIT #{offset}, 10;
        </script>    
        """)
    List<Member> searchResult(int offset, String searchType, String keyword);

    @Select("""
            <script>
            SELECT COUNT(*)
            FROM member
            WHERE 
                <trim prefixOverrides="OR">
                    <if test="searchType == 'all' or searchType == 'email'">
                        email LIKE CONCAT('%', #{keyword}, '%')
                    </if>
                    <if test="searchType == 'all' or searchType == 'nickname'">
                        OR nickname LIKE CONCAT('%', #{keyword}, '%')
                    </if>
                    <if test="searchType == 'all' or searchType == 'name'">
                        OR name LIKE CONCAT('%', #{keyword}, '%')
                    </if>
                    <if test="searchType == 'all' or searchType == 'phone'">
                        OR phone LIKE CONCAT('%', #{keyword}, '%')
                    </if>
                </trim>
            </script>
        """)
    Integer countResult(String searchType, String keyword);
}
