package com.example.be.controller.cs.inquiry;

import com.example.be.dto.cs.inquiry.Inquiry;
import com.example.be.service.cs.inquiry.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cs/inquiry")
public class InquiryController {
    final InquiryService service;

    @PostMapping("add")
    public void add(@RequestBody Inquiry inquiry) {
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
    public void update(@RequestBody Inquiry inquiry) {
        service.update(inquiry);
    }

    @DeleteMapping("delete/{id}")
    public void delete(@PathVariable int id) {
        service.delete(id);
    }


}
