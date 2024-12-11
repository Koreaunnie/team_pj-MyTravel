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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class KakaoController {
  private final KakaoService kakaoService;

  @PostMapping("/login/kakao")
  public ResponseEntity<KakaoInfo> kakaoLogin(@RequestBody KakaoInfo request) {

    System.out.println(request);

    try {
      KakaoInfo response = kakaoService.kakaoLogin(request);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
  }
}
