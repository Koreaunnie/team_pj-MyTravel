package com.example.be.controller.notice;

import com.example.be.dto.notice.Notice;
import com.example.be.service.notice.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/notice")
@RequiredArgsConstructor
public class NoticeController {

    final NoticeService service;

    @GetMapping("list")
    public Map<String, Object> list(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                    @RequestParam(value = "type", defaultValue = "all") String searchType,
                                    @RequestParam(value = "keyword", defaultValue = "") String searchKeyword) {
        return service.list(page, searchType, searchKeyword);
    }

    @GetMapping("view/{id}")
    public Map<String, Object> view(@PathVariable Integer id, Authentication auth) {
        return service.view(id, auth);
    }

    @PostMapping("write")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> write(@RequestBody Notice notice, Authentication auth) {
        if (service.checkAdmin(auth)) {
            if (service.checkNotice(notice)) {
                service.write(notice, auth);
                return ResponseEntity.ok().body(Map.of("message", "success",
                        "text", STR."\{notice.getId()}번 공지사항 등록되었습니다"));
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", Map.of("type", "warning",
                                "text", "제목이나 본문이 비어있을 수 없습니다.")));
            }
        } else {
            return ResponseEntity.status(403)
                    .body(Map.of("message", Map.of("type", "error",
                            "text", "작성 권한이 없습니다.")));
        }
    }
}
