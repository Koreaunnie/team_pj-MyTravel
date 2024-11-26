package com.example.be.controller.member;

import com.example.be.dto.member.Member;
import com.example.be.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequestMapping
@RequiredArgsConstructor
@RestController("/api/member")
public class MemberController {
  final MemberService service;

  @PostMapping("signup")
  public ResponseEntity<Map<String, Object>> signup(@RequestBody Member member) {
    try {
      if (service.add(member)) {
        return ResponseEntity.ok().body(Map.of("message",
                Map.of("type", "success", "text", "회원 가입 완료")));
      } else {
        return ResponseEntity.internalServerError().body(Map.of("message",
                Map.of("type", "error", "text", "회원 가입 중 문제가 발생하였습니다.")));
      }
    } catch (DuplicateKeyException e) {
      return ResponseEntity.internalServerError().body(Map.of("message",
              Map.of("type", "error", "text", "이미 존재하는 ID 혹은 이메일입니다.")));
    }
  }
}
