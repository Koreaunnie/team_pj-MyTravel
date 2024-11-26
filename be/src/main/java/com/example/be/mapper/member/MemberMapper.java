package com.example.be.mapper.member;

import com.example.be.dto.member.Member;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {

  @Insert("""
          INSERT INTO member 
          (id, password, name, email, phone, inserted)
          VALUES (#{id}, #{password}, #{name}, #{email}, #{phone}, #{inserted})
          """)
  int insert(Member member);
}
