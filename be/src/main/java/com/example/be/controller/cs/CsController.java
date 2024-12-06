package com.example.be.controller.cs;

import com.example.be.dto.cs.inquiry.Inquiry;
import com.example.be.service.cs.CsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cs")
public class CsController {
    final CsService service;

    @PostMapping("inquiry/add")
    public void add(@RequestBody Inquiry inquiry) {
        service.add(inquiry);
    }

    @GetMapping("inquiry/list")
    public List<Inquiry> list() {
        return service.list();
    }

    @GetMapping("inquiry/view/{id}")
    public Inquiry list(@PathVariable int id) {
        return service.get(id);
    }

    @PutMapping("inquiry/update")
    public void edit(@RequestBody Inquiry inquiry) {
        service.update(inquiry);
    }
}
