package com.example.be.controller.cs;

import com.example.be.service.cs.CsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cs/inquiry")
public class CsController {
    final CsService service;

    @PostMapping("add")
    public void add() {

    }
}
