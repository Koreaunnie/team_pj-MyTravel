package com.example.be.controller.member;

import com.example.be.dto.member.KakaoResponse;
import com.example.be.service.member.KakaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class KakaoController {
  private final KakaoService kakaoService;

  @PostMapping("/login/kakao")
  public ResponseEntity<KakaoResponse> kakaoLogin(
          @RequestHeader("Authorization") String authorization,
          @RequestBody Map<String, String> tokenData) {
    try {
      //Authorization 헤더 검증
      if (authorization == null || !authorization.startsWith("Bearer ")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String access_token = tokenData.get("accessToken");
      String refresh_token = tokenData.get("refreshToken");


      KakaoResponse kakaoResponse = kakaoService.verifyAccessToken(access_token, refresh_token);
      return ResponseEntity.ok(kakaoResponse);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
  }
}
