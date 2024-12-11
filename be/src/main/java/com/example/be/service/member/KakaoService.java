package com.example.be.service.member;

import com.example.be.dto.member.KakaoInfo;
import com.example.be.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
@Transactional
@RequiredArgsConstructor
public class KakaoService {
  private final MemberMapper mapper;

  @Value("${kakao.token-uri}")
  private String kakaoTokenUri;
  @Value("${kakao.user-info-uri}")
  private String kakaoUserInfoUri;
  @Value("${kakao.redirect.uri}")
  private String kakaoRedirectUri;
  @Value("${kakao.client.id}")
  private String kakaoClientId;

  RestTemplate restTemplate = new RestTemplate();


  public KakaoInfo kakaoLogin(KakaoInfo request) {

    String kakaoName = request.getNickname();

    System.out.println(kakaoName);
    //1. mapper의 멤버 정보와 이름 대조 if(대조){없으면 생성}
    if (mapper.hasSameName(kakaoName) != 1) {
      //없으면 회원가입: kakao=true
      System.out.println("계정 없음 => 회원 가입");
    } else {
      //있으면 내용 token으로 전달 + 카카오 연동 true로 변경
      System.out.println("계정 있음!");
    }

    return null;
  }

}
