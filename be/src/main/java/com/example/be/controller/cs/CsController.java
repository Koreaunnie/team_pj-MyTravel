package com.example.be.controller.cs;

import com.example.be.dto.cs.inquiry.Inquiry;
import com.example.be.service.cs.CsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cs")
public class CsController {
    final CsService service;

    @PostMapping("inquiry/add")
    public void add(@RequestBody Inquiry inquiry) {
        service.add(inquiry);
    }
}
