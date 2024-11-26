package com.example.be.service.member;

import com.example.be.dto.member.Member;
import com.example.be.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {
  final MemberMapper mapper;

  public boolean add(Member member) {
    int cnt = mapper.insert(member);
    return cnt == 1;
  }

  public boolean checkEmail(String email) {
    return mapper.selectByEmail(email) != null;
  }

  public List<Member> list() {
    return mapper.selectAll();
  }

  public Member get(String email) {
    return mapper.selectByEmail(email);
  }

  public boolean remove(Member member) {
    int cnt = 0;

    Member db = mapper.selectByEmail(member.getEmail());
    if (db != null) {
      if (db.getPassword().equals(member.getPassword())) {
        cnt = mapper.deleteByEmail(member.getEmail());
      }
    }
    return cnt == 1;
  }
}
