package com.example.be.service.member;

import com.example.be.dto.member.Member;
import com.example.be.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
