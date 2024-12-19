package com.example.be.controller.cs.inquiry.answer;

import com.example.be.dto.cs.inquiry.answer.InquiryAnswer;
import com.example.be.service.cs.inquiry.InquiryService;
import com.example.be.service.cs.inquiry.answer.InquiryAnswerService;
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
@RequestMapping("/api/cs/inquiry/answer")
public class InquiryAnswerController {
    final InquiryAnswerService service;
    final InquiryService inquiryService;
    final MemberService memberService;

    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> add(@RequestBody InquiryAnswer answer,
                                                   Authentication authentication) {

        String userEmail = authentication.getName();
        String userNickname = memberService.getNicknameByEmail(userEmail);

        answer.setMemberEmail(userEmail);
        answer.setMemberNickname(userNickname);

        if (service.add(answer) && inquiryService.hasAnswer(answer.getInquiryId())) {
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
    public List<InquiryAnswer> list(@PathVariable Integer inquiryId) {
        return service.list(inquiryId);
    }

    @PutMapping("edit")
    public ResponseEntity<Map<String, Object>> edit(@RequestBody InquiryAnswer inquiryAnswer) {
        if (service.update(inquiryAnswer)) {
            return ResponseEntity.ok().body(Map.of("message",
                    Map.of("type", "success",
                            "text", "댓글이 수정되었습니다.")));
        } else {
            return ResponseEntity.internalServerError().body(Map.of("message",
                    Map.of("type", "error",
                            "text", "댓글이 수정되지 않았습니다.")));
        }
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable int id) {
        if (service.delete(id)) {
            return ResponseEntity.ok().body(Map.of("message",
                    Map.of("type", "success",
                            "text", "댓글이 삭제되었습니다.")));
        } else {
            return ResponseEntity.internalServerError().body(Map.of("message",
                    Map.of("type", "error",
                            "text", "댓글이 삭제되지 않았습니다.")));
        }
    }
}
