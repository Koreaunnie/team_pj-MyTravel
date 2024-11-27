package com.example.be.controller.community;

import com.example.be.dto.community.Community;
import com.example.be.dto.member.Member;
import com.example.be.service.community.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    final CommunityService service;

    @GetMapping("list")
    public List<Map<String, Object>> list(@RequestParam(value = "page", defaultValue = "1") Integer page) {

        return service.list(page);
    }


    @PostMapping("write")
    public void write(Community community, Member member) {
        community.setWriter(member.getNickname());
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

    @DeleteMapping("delete/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    // TODO : UPDATE 기능 추가


}
