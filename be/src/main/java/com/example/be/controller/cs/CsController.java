package com.example.be.controller.cs;

import com.example.be.dto.cs.inquiry.Inquiry;
import com.example.be.service.cs.inquiry.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cs")
public class CsController {
    final InquiryService service;

    @GetMapping("index")
    public List<Inquiry> index() {
        return service.getInquiry();
    }
}
