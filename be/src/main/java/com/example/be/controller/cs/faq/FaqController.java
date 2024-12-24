package com.example.be.controller.cs.faq;

import com.example.be.dto.cs.faq.Faq;
import com.example.be.service.cs.faq.FaqService;
import com.example.be.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cs/faq")
public class FaqController {
    final FaqService service;
    final MemberService memberService;

    @PostMapping("add")
    @PreAuthorize("hasAuthority('SCOPE_admin')")
    public ResponseEntity<Map<String, Object>> add(@RequestBody Faq faq,
                                                   Authentication authentication) {
        if (!authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", Map.of("type", "warning", "text", "로그인이 필요합니다.")));
        }

        if (memberService.isAdmin(authentication)) {
            if (service.add(faq, authentication)) {
                return ResponseEntity.ok().body(Map.of(
                    "message", Map.of("type", "success",
                        "text", "FAQ가 저장되었습니다."),
                    "id", faq.getId()));
            } else {
                return ResponseEntity.status(500).body(Map.of(
                    "message", Map.of("type", "warning", "text", "FAQ 저장에 실패하였습니다.")));
            }
        } else {
            return ResponseEntity.status(403)
                .body(Map.of("message", Map.of("type", "warning",
                    "text", "관리자만 FAQ를 작성할 수 있습니다.")));
        }
    }

    @GetMapping("list")
    public Map<String, Object> list(
        @RequestParam(value = "page", defaultValue = "1") Integer page,
        @RequestParam(value = "type", defaultValue = "all") String type,
        @RequestParam(value = "key", defaultValue = "") String keyword) {
//        System.out.println(page);
//        System.out.println(type);
//        System.out.println(keyword);
        return service.list(page, type, keyword);
    }

    @GetMapping("view/{id}")
    public Faq view(@PathVariable int id) {
        return service.view(id);
    }

    @PutMapping("update")
    @PreAuthorize("hasAuthority('SCOPE_admin')")
    public ResponseEntity<Map<String, Object>> update(@RequestBody Faq faq,
                                                      Authentication authentication) {
        if (memberService.isAdmin(authentication)) {
            if (service.update(faq)) {
                return ResponseEntity.ok().body(Map.of(
                    "message", Map.of("type", "success",
                        "text", "FAQ가 수정되었습니다.")));
            } else {
                return ResponseEntity.status(500).body(Map.of(
                    "message", Map.of("type", "warning", "text", "FAQ 수정에 실패하였습니다.")));
            }
        }
        return ResponseEntity.status(403)
            .body(Map.of("message", Map.of("type", "warning",
                "text", "관리자만 FAQ를 수정할 수 있습니다.")));
    }

    @DeleteMapping("delete/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable int id,
                                                      Authentication authentication) {

        String userEmail = authentication.getName();
        String userNickname = memberService.getNicknameByEmail(userEmail);
        Faq faq = service.view(id);

        if (faq != null && faq.getWriter().equals(userNickname) && memberService.hasAccess(userEmail, authentication)) {
            if (service.delete(id)) {
                return ResponseEntity.ok().body(Map.of(
                    "message", Map.of("type", "success",
                        "text", "FAQ가 삭제되었습니다.")));
            } else {
                return ResponseEntity.internalServerError().body(Map.of(
                    "message", Map.of("type", "warning",
                        "text", "FAQ가 삭제 중 문제가 발생하였습니다.")));

            }
        } else {
            return ResponseEntity.status(401).body(Map.of("message", Map.of(
                "type", "error",
                "text", "삭제 권한이 없습니다.")));
        }
    }
}
