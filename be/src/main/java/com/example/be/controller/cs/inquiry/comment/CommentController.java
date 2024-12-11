package com.example.be.controller.cs.inquiry.comment;

import com.example.be.dto.cs.inquiry.comment.Comment;
import com.example.be.service.cs.inquiry.comment.CommentService;
import com.example.be.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cs/inquiry/comment")
public class CommentController {
    final CommentService service;
    final MemberService memberService;

    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public void add(@RequestBody Comment comment,
                    Authentication authentication) {
        System.out.println(comment);
        
        String userEmail = authentication.getName();
        String userNickname = memberService.getNicknameByEmail(userEmail);

        comment.setMemberEmail(userEmail);
        comment.setMemberNickname(userNickname);

        service.add(comment);
    }


}
