package com.example.be.controller.cs.faq;

import com.example.be.dto.cs.faq.Faq;
import com.example.be.service.cs.faq.FaqService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cs/faq")
public class FaqController {
    final FaqService service;

    @PostMapping("add")
    public void add(@RequestBody Faq faq) {
        service.add(faq);
    }
}
