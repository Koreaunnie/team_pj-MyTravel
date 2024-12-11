package com.example.be.controller.member;

import com.example.be.dto.member.KakaoInfo;
import com.example.be.service.member.KakaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class KakaoController {
  private final KakaoService kakaoService;

  @PostMapping("/login/kakao")
  public ResponseEntity<Map<String, Object>> kakaoLogin(@RequestBody KakaoInfo request) {
    System.out.println("받은 정보:" + request);

    //토큰 생성해옴
    String token = kakaoService.token(request);

    if (token != null) {
      //토큰 있으면 토큰 반환
      return ResponseEntity.ok(Map.of("token", token));
    } else {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
  }
}
