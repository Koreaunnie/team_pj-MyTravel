package com.example.be.service.member;

import com.example.be.dto.member.Member;
import com.example.be.dto.member.MemberEdit;
import com.example.be.mapper.member.MemberMapper;
import com.example.be.mapper.tour.TourMapper;
import com.example.be.service.tour.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {
  final MemberMapper mapper;
  final JwtEncoder jwtEncoder;
  private final TourService tourService;
  private final TourMapper tourMapper;

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
    if (db != null && db.getPassword().equals(member.getPassword())) {

      List<Integer> tourBoards = tourMapper.selectByPartner(db.getNickname());
      for (Integer tourId : tourBoards) {
        tourService.delete(tourId);
      }
      cnt = mapper.deleteByEmail(member.getEmail());
    }
    return cnt == 1;
  }

  public boolean update(MemberEdit member) {
    int cnt = 0;
    Member db = mapper.selectByEmail(member.getEmail());
    if (db != null) {
      if (db.getPassword().equals(member.getOldPassword())) {
        cnt = mapper.update(member);

      }
    }
    return cnt == 1;
  }

  public String token(Member member) {
    Member db = mapper.selectByEmail(member.getEmail());
    if (db != null) {
      if (db.getPassword().equals(member.getPassword())) {
        //token 생성
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .subject(member.getEmail())
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60 * 60 * 24 * 7))
                .build();
        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
      }
    }

    return null;
  }


  public boolean checkNickname(String nickname) {
    return mapper.selectByNickname(nickname) != null;
  }
}
