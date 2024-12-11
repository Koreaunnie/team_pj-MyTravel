package com.example.be.controller.member;

import com.example.be.dto.cs.inquiry.Inquiry;
import com.example.be.dto.member.Member;
import com.example.be.dto.member.MemberEdit;
import com.example.be.service.cs.inquiry.InquiryService;
import com.example.be.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {
    final MemberService service;
    final InquiryService inquiryService;

    @PostMapping("login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Member member) {
        String token = service.token(member);

        if (token == null) {
            //로그인 실패
            return ResponseEntity.status(401).body(Map.of("message",
                    Map.of("type", "warning", "text", "정보가 일치하지 않습니다.")));
        } else {
            //로그인 성공
            return ResponseEntity.ok(Map.of("token", token, "message",
                    Map.of("type", "success", "text", "로그인 되었습니다.")));
        }
    }

    @PutMapping("update")
    public ResponseEntity<Map<String, Object>> update(
            MemberEdit member,
            Authentication auth,
            @RequestParam(value = "uploadFiles", required = false) MultipartFile uploadFiles,
            Inquiry inquiry) {
        try {
            if (service.hasAccess(member.getEmail(), auth) || service.isAdmin(auth)) {
                if (service.update(member, uploadFiles)) {
                    // 회원 닉네임 변경 시 문의글 닉네임도 변경
                    inquiry.setWriter(member.getEmail());
                    inquiry.setWriterNickname(member.getNickname());
                    inquiryService.updateWriterNickname(inquiry);

                    return ResponseEntity.ok(Map.of("message",
                            Map.of("type", "success", "text", "수정 완료")));
                } else {
                    return ResponseEntity.badRequest().body(Map.of("message",
                            Map.of("type", "warning", "text", "수정 실패")));
                }
            } else {
                return ResponseEntity.badRequest().body(Map.of("message",
                        Map.of("type", "warning", "text", "수정 권한이 없습니다.")));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message",
                    Map.of("type", "warning", "text", "오류 발생")));
        }
    }

    @DeleteMapping("remove")
    public ResponseEntity<Map<String, Object>> remove(@RequestBody Member member) {
        if (service.remove(member)) {
            return ResponseEntity.ok(Map.of("message",
                    Map.of("type", "success", "text", "탈퇴 완료")));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message",
                    Map.of("type", "warning", "text", "비밀번호가 일치하지 않습니다.")));
        }
    }

    @GetMapping("{email}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Member> getMember(@PathVariable String email, Authentication auth) {
        if (service.hasAccess(email, auth) || service.isAdmin(auth)) {
            return ResponseEntity.ok(service.get(email));
        } else {
            return ResponseEntity.status(403).build();
        }
    }

    @GetMapping("partners")
    @PreAuthorize("hasAuthority('SCOPE_admin')")
    public List<Member> partnerList() {
        return service.partnerList();
    }

    @GetMapping("list")
    @PreAuthorize("hasAuthority('SCOPE_admin')")
    public List<Member> list() {
        return service.list();
    }

    @GetMapping(value = "check", params = "nickname")
    public ResponseEntity<Map<String, Object>> checkNickname(@RequestParam String nickname) {
        if (service.checkNickname(nickname)) {
            //중복
            return ResponseEntity.ok().body(Map.of("message",
                    Map.of("type", "warning", "text", "이미 존재하는 닉네임입니다."),
                    "available", false));
        } else {
            //중복 아님
            return ResponseEntity.ok().body(Map.of("message",
                    Map.of("type", "info", "text", "사용 가능한 닉네임입니다."),
                    "available", true));
        }
    }

    @GetMapping(value = "check", params = "email")
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
    public ResponseEntity<Map<String, Object>> signup(
            Member member,
            @RequestParam(value = "files[]", required = false) MultipartFile[] files) {
        try {
            if (service.add(member, files)) {
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
