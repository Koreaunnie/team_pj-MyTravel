package com.example.be.controller.cs.inquiry;

import com.example.be.dto.cs.inquiry.Inquiry;
import com.example.be.service.cs.inquiry.InquiryService;
import com.example.be.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public void delete(@PathVariable int id,
                       Authentication authentication) {
        String writer = authentication.getName();
        service.delete(id, writer);
    }


}
