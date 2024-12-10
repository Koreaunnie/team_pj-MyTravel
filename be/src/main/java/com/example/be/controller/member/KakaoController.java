package com.example.be.controller.member;

import com.example.be.service.member.KakaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class KakaoController {
  private final KakaoService kakaoService;

//  @GetMapping("/login/oauth/kakao")
//  @ResponseBody
//  public ResponseEntity<KakaoResponse> kakaoLogin(
//          @RequestParam String code
//  ) {
//    try {
//      String currentDomain = request.getServerName();
//      return ResponseEntity.ok(kakaoService.kakaoLogin(code, currentDomain));
//    } catch (NoSuchElementException e) {
//      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item Not Found");
//    }
//  }
}
