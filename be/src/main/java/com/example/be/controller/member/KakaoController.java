package com.example.be.controller.member;

import com.example.be.dto.member.KakaoResponse;
import com.example.be.service.member.KakaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class KakaoController {
  private final KakaoService kakaoService;

  @GetMapping("/login/kakao")
  public ResponseEntity<KakaoResponse> kakaoLogin(@RequestParam String code) {
    try {
      KakaoResponse kakaoResponse = kakaoService.kakaoLogin(code);
      return ResponseEntity.ok(kakaoResponse);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
  }
}
