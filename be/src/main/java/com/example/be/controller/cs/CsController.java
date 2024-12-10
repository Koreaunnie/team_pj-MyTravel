package com.example.be.controller.cs;

import com.example.be.service.cs.faq.FaqService;
import com.example.be.service.cs.inquiry.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cs")
public class CsController {
    final FaqService faqService;
    final InquiryService inquiryService;

    @GetMapping("index")
    public Map<String, Object> getIndex() {
        Map<String, Object> result = new HashMap<>();

        result.put("faq", faqService.getFaq());
        result.put("inquiry", inquiryService.getInquiry());

        return result;
    }

}
