package com.example.be.controller.community;

import com.example.be.dto.community.Community;
import com.example.be.service.community.CommunityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
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
    public void write(@RequestBody Community community, Authentication auth) {

        service.write(community, auth);
    }

    @GetMapping("view/{id}")
    public Map<String, Object> view(@PathVariable Integer id) {
        return service.view(id);
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
