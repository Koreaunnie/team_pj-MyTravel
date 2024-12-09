package com.example.be.controller.community;

import com.example.be.dto.community.Community;
import com.example.be.dto.community.CommunityComment;
import com.example.be.service.community.CommunityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    final CommunityService service;

    @GetMapping("list")
    public Map<String, Object> list(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                    @RequestParam(value = "type", defaultValue = "all") String searchType,
                                    @RequestParam(value = "keyword", defaultValue = "") String searchKeyword) {
        return service.list(page, searchType, searchKeyword);
    }


    @PostMapping("write")
    public void write(Community community, @RequestParam(value = "files[]", required = false) MultipartFile[] files, Authentication auth) {

        service.write(community, files, auth);
    }

    @GetMapping("view/{id}")
    public Map<String, Object> view(@PathVariable Integer id) {
        return service.view(id);
    }

    @PutMapping("edit")
    public void edit(@RequestBody Community community,
                     @RequestParam(value = "removeFiles[]", required = false) List<String> removeFiles,
                     @RequestParam(value = "uploadFiles[]", required = false) MultipartFile[] uploadFiles,
                     Authentication auth) {
        service.edit(community, removeFiles, uploadFiles, auth);
    }

    @DeleteMapping("delete/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    // TODO : UPDATE 기능 추가


//    TODO :  게시판 댓글 기능

    @PostMapping("comment/write")
    public void commentWrite(@RequestBody CommunityComment communityComment, Authentication auth) {

        System.out.println(communityComment);
        System.out.println(auth);
        service.commentWrite(communityComment, auth);
    }
}
