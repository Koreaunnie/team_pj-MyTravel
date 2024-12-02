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
}
