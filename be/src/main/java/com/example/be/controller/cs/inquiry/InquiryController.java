package com.example.be.controller.cs.inquiry;

import com.example.be.dto.cs.inquiry.Inquiry;
import com.example.be.service.cs.inquiry.InquiryService;
import com.example.be.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

        String writer = authentication.getName();
        String writerNickName = memberService.getNicknameByEmail(writer);

        inquiry.setWriter(writer);
        inquiry.setWriterNickname(writerNickName);

        service.add(inquiry);
    }

    @GetMapping("list")
    public Map<String, Object> list(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                    @RequestParam(value = "st", defaultValue = "all") String searchType,
                                    @RequestParam(value = "sk", defaultValue = "") String searchKeyword) {
        return service.list(page, searchType, searchKeyword);
    }

    @GetMapping("view/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> get(@PathVariable int id, Authentication authentication) {
        // 문의사항
        Inquiry inquiry = service.get(id);

        // 권한 체크
        boolean isAdmin = memberService.isAdmin(authentication);
        boolean isWriter = authentication.getName().equals(inquiry.getWriter());

        if (inquiry.isSecret() && !isAdmin && !isWriter) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", Map.of(
                            "type", "warning",
                            "text", "비공개 문의내역은 작성자 본인만 확인할 수 있습니다."
                    )));
        }
        return ResponseEntity.ok(Map.of("inquiry", inquiry));
    }

    @PutMapping("update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> update(@RequestBody Inquiry inquiry,
                                                      Authentication authentication) {

        inquiry.setWriter(authentication.getName());

        // 작성자와 로그인한 사용자가 동일한지 확인
        if (authentication.getName().equals(inquiry.getWriter())) {
            boolean isUpdated = service.update(inquiry);
            if (isUpdated) {
                return ResponseEntity.ok(Map.of("message", Map.of(
                        "type", "success",
                        "text", "문의글이 수정되었습니다."
                )));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                        "message", Map.of(
                                "type", "error",
                                "text", "문의글 수정 중 오류가 발생했습니다."
                        )));
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "message", Map.of(
                            "type", "warning",
                            "text", "자신이 작성한 글만 수정할 수 있습니다."
                    )));
        }
    }

    @DeleteMapping("delete/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable int id,
                                                      @RequestBody Map<String, String> request,
                                                      Authentication authentication) {
        String password = request.get("password");

        if (!memberService.isPasswordValid(authentication.getName(), password)) {
            return ResponseEntity.badRequest().body(Map.of("message", Map.of(
                    "type", "warning", "text", "비밀번호가 일치하지 않습니다."
            )));
        }

        if (service.delete(id, authentication.getName())) {
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
