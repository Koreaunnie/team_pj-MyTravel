package com.example.be.controller.cs.inquiry.comment;

import com.example.be.dto.cs.inquiry.comment.Comment;
import com.example.be.service.cs.inquiry.comment.CommentService;
import com.example.be.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cs/inquiry/comment")
public class CommentController {
    final CommentService service;
    final MemberService memberService;

    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> add(@RequestBody Comment comment,
                                                   Authentication authentication) {

        String userEmail = authentication.getName();
        String userNickname = memberService.getNicknameByEmail(userEmail);

        comment.setMemberEmail(userEmail);
        comment.setMemberNickname(userNickname);

        if (service.add(comment)) {
            return ResponseEntity.ok(Map.of("message", Map.of(
                    "type", "success",
                    "text", "댓글이 작성되었습니다."
            )));

        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", Map.of(
                            "type", "warning",
                            "text", "댓글 작성 중 오류가 생겼습니다."
                    )));
        }
    }

    @GetMapping("list/{inquiryId}")
    public List<Comment> list(@PathVariable Integer inquiryId) {
        return service.list(inquiryId);
    }

    @PutMapping("edit")
    public ResponseEntity<Map<String, Object>> edit(@RequestBody Comment comment) {
        if (service.update(comment)) {
            return ResponseEntity.ok().body(Map.of("message",
                    Map.of("type", "success",
                            "text", "댓글이 수정되었습니다.")));
        } else {
            return ResponseEntity.internalServerError().body(Map.of("message",
                    Map.of("type", "error",
                            "text", "댓글이 수정되지 않았습니다.")));
        }
    }
}
