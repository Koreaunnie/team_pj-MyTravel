package com.example.be.controller.cs.faq;

import com.example.be.dto.cs.faq.Faq;
import com.example.be.service.cs.faq.FaqService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cs/faq")
public class FaqController {
    final FaqService service;

    @PostMapping("add")
    public void add(@RequestBody Faq faq) {
        service.add(faq);
    }

    @GetMapping("list")
    public List<Faq> list() {
        return service.list();
    }

    @GetMapping("view/{id}")
    public Faq view(@PathVariable int id) {
        return service.view(id);
    }

    @PutMapping("update")
    public void update(@RequestBody Faq faq) {
        service.update(faq);
    }

    @DeleteMapping("delete/{id}")
    public void delete(@PathVariable int id) {
        service.delete(id);
    }
}
