package com.example.be.mapper.member;

import com.example.be.dto.member.Member;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

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
}
