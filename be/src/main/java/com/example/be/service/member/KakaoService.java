package com.example.be.service.member;

import com.example.be.dto.member.CustomMultipartFile;
import com.example.be.dto.member.KakaoInfo;
import com.example.be.dto.member.Member;
import com.example.be.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class KakaoService {
  final JwtEncoder jwtEncoder;
  private final MemberMapper mapper;
  private final MemberService memberService;

  @Value("${kakao.token-uri}")
  private String kakaoTokenUri;
  @Value("${kakao.user-info-uri}")
  private String kakaoUserInfoUri;
  @Value("${kakao.redirect.uri}")
  private String kakaoRedirectUri;
  @Value("${kakao.client.id}")
  private String kakaoClientId;

  RestTemplate restTemplate = new RestTemplate();

  public String kakaoLogin(KakaoInfo request) {

    //1. mapper의 멤버 정보와 이름 대조 if(없){없으면 생성}
    if (mapper.checkKakaoAccount(request.getKakaoId()) != 1) {
      //없으면 회원가입: kakao=true
      System.out.println("계정 없음 => 회원 가입");
    } else {
      //있으면 내용 token생성 + 카카오 연동 true로 변경
      System.out.println("계정 있음! 로그인");


      String kakaoToken = token(request);
      return kakaoToken;
    }

    return null;
  }

  public String token(KakaoInfo request) {
    List<String> auths = mapper.selectAuthByMemberEmail(request.getKakaoId());
    String authsString = auths.stream()
            .collect(Collectors.joining(" "));

    //1. 멤버에 kakao와 동일한 id 있는지 조회
    int account = mapper.checkKakaoAccount(request.getKakaoId());
    String nickname = mapper.selectNicknameByEmail(request.getKakaoId());


    //있으면 token 생성해서 반환
    //token 정보: nickname, email(sub), 권한(scope)
    if (account != 0) {
      JwtClaimsSet claims = JwtClaimsSet.builder()
              .issuer("self")
              .subject(request.getKakaoId())
              .issuedAt(Instant.now())
              .expiresAt(Instant.now().plusSeconds(60 * 60 * 24 * 7))
              .claim("scope", authsString)
              .claim("nickname", nickname)
              .build();
      return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
    return null;
  }

  public boolean add(Member member, MultipartFile[] files) {
    int cnt = 0;

    memberService.add(member, files);
    cnt = mapper.setKakaoAccount(member.getEmail());

    return cnt == 1;
  }

  public MultipartFile[] convertUrlToMultipartFile(String kakaoImageSrc) throws IOException {
    URL url = new URL(kakaoImageSrc);

    try (InputStream inputStream = url.openStream();
         ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
      BufferedImage urlImage = ImageIO.read(inputStream);
      ImageIO.write(urlImage, "jpg", bos);
      byte[] byteArray = bos.toByteArray();
      MultipartFile[] multipartFile = new CustomMultipartFile[]{new CustomMultipartFile(byteArray, kakaoImageSrc)};

      return multipartFile;

    }
  }
}
