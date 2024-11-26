package com.example.be.controller.community;

import com.example.be.dto.Community;
import com.example.be.service.community.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    final CommunityService service;

    @GetMapping("list")
    public void list(@RequestParam(value = "page", defaultValue = "1") Integer page) {
        service.list(page);
    }

    @PostMapping("write")
    public void write(Community community) {
        service.write(community);
    }

    @GetMapping("view/{id}")
    public void view(@PathVariable Integer id) {
        service.view(id);
    }

    @PostMapping("edit")
    public void edit(Community community) {
        service.edit(community);
    }


    // TODO : UPDATE 기능 추가


}
