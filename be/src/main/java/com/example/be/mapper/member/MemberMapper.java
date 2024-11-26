package com.example.be.mapper.member;

import com.example.be.dto.member.Member;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface MemberMapper {

  @Insert("""
          INSERT INTO member 
          (email, nickname, password, name, phone, inserted)
          VALUES (#{email}, #{nickname}, #{password}, #{name}, #{phone}, #{inserted})
          """)
  int insert(Member member);

  @Select("""
          SELECT * FROM member
          WHERE email = #{email}""")
  Member selectByEmail(String email);
}
