package com.example.be.service.member;

import com.example.be.dto.member.AuthTokens;
import com.example.be.dto.member.KakaoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class KakaoService {

  @Value("${kakao.token-uri}")
  private String kakaoTokenUri;
  @Value("${kakao.user-info-uri}")
  private String kakaoUserInfoUri;
  @Value("${kakao.redirect.uri}")
  private String kakaoRedirectUri;
  @Value("${kakao.client.id}")
  private String kakaoClientId;

  RestTemplate restTemplate = new RestTemplate();


  public KakaoResponse kakaoLogin(String code) {

    //1. 액세스 토큰 요청
    String tokenRequestUrl = kakaoTokenUri + "?grant_type=authorization_code" +
            "&client_id=" + kakaoClientId +
            "&redirect_uri=" + kakaoRedirectUri +
            "&code=" + code;

    ResponseEntity<Map> tokenResponse =
            restTemplate.getForEntity(tokenRequestUrl, null, Map.class);
    Map<String, Object> tokenResponseBody = tokenResponse.getBody();

    if (tokenResponseBody == null || !tokenResponseBody.containsKey("access_token")) {
      throw new RuntimeException("카카오 인증 토큰 받지 못함");
    }

    String accessToken = tokenResponseBody.get("access_token").toString();
    String refreshToken = tokenResponseBody.get("refresh_token").toString();

    //2. 사용자 정보 요청
    HttpHeaders headers = new HttpHeaders();
    headers.add("Authorization", "Bearer " + accessToken);

    HttpEntity<String> entity = new HttpEntity<>(headers);
    ResponseEntity<Map> userResponse = restTemplate.exchange(kakaoUserInfoUri, HttpMethod.GET, entity, Map.class);

    Map<String, Object> kakaoAccount = (Map<String, Object>) userResponse.getBody().get("kakao_account");
    String nickname = (String) ((Map<String, Object>) kakaoAccount.get("profile")).get("nickname");

    AuthTokens authTokens = new AuthTokens(accessToken, refreshToken);
    System.out.println(nickname);
    System.out.println(authTokens);
    return new KakaoResponse(nickname, authTokens);
  }

  public KakaoResponse verifyAccessToken(String accessToken, String refreshToken) {
    HttpHeaders headers = new HttpHeaders();
    System.out.println("Authorization 헤더: " + headers.get("Authorization"));

    headers.add("Authorization", "Bearer " + accessToken);
    HttpEntity<String> entity = new HttpEntity<>(headers);
    ResponseEntity<Map> userResponse = restTemplate.exchange(kakaoUserInfoUri, HttpMethod.GET, entity, Map.class);

    if (userResponse.getStatusCode().is2xxSuccessful()) {
      Map<String, Object> kakaoAccount = (Map<String, Object>) userResponse.getBody().get("kakao_account");
      String nickname = (String) ((Map<String, Object>) kakaoAccount.get("profile")).get("nickname");

      AuthTokens tokens = new AuthTokens(accessToken, refreshToken);
      return new KakaoResponse(nickname, tokens);
    } else {
      throw new RuntimeException("사용자 정보 조회 실패");
    }
  }
}
