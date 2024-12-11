package com.example.be.controller.cs.inquiry;

import com.example.be.dto.cs.inquiry.Inquiry;
import com.example.be.service.cs.inquiry.InquiryService;
import com.example.be.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cs/inquiry")
public class InquiryController {
    final InquiryService service;
    final MemberService memberService;

    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public void add(@RequestBody Inquiry inquiry,
                    Authentication authentication) {

        String writer = memberService.getNicknameByEmail(authentication.getName());
        inquiry.setWriter(writer);
        service.add(inquiry);
    }

    @GetMapping("list")
    public List<Inquiry> list() {
        return service.list();
    }

    @GetMapping("view/{id}")
    public Inquiry list(@PathVariable int id) {
        return service.get(id);
    }

    @PutMapping("update")
    @PreAuthorize("isAuthenticated()")
    public void update(@RequestBody Inquiry inquiry,
                       Authentication authentication) {

        String writer = memberService.getNicknameByEmail(authentication.getName());
        inquiry.setWriter(writer);
        service.update(inquiry);
    }

    @DeleteMapping("delete/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable int id,
                                                      @RequestBody Map<String, String> request,
                                                      Authentication authentication) {
        String writer = memberService.getNicknameByEmail(authentication.getName());
        String password = request.get("password");

        if (!memberService.isPasswordValid(authentication.getName(), password)) {
            return ResponseEntity.badRequest().body(Map.of("message", Map.of(
                    "type", "warning", "text", "비밀번호가 일치하지 않습니다."
            )));
        }

        if (service.delete(id, writer)) {
            // 성공
            return ResponseEntity.ok(Map.of("message", Map.of(
                    "type", "success", "text", "문의 글이 삭제되었습니다.")));
        } else {
            // 실패
            return ResponseEntity.badRequest().body(Map.of("message", Map.of(
                    "type", "warning", "text", "삭제 중 오류가 생겼습니다.")));
        }
    }
}
