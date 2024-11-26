package com.example.be.controller.member;

import com.example.be.dto.member.Member;
import com.example.be.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequestMapping
@RequiredArgsConstructor
@RestController("/api/member")
public class MemberController {
  final MemberService service;

  @GetMapping("checkEmail")
  public ResponseEntity<Map<String, Object>> checkEmail(@RequestParam String email) {
    if (service.checkEmail(email)) {
      //중복
      return ResponseEntity.ok().body(Map.of("message",
              Map.of("type", "warning", "text", "이미 가입된 이메일입니다."),
              "available", false));
    } else {
      //중복 아님
      return ResponseEntity.ok().body(Map.of("message",
              Map.of("type", "info", "text", "사용 가능한 아이디입니다."),
              "available", true));
    }
  }

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
              Map.of("type", "error", "text", "이미 존재하는 이메일 혹은 닉네임입니다.")));
    }
  }
}
