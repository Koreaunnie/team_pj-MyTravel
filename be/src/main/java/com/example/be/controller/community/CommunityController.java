package com.example.be.controller.community;

import com.example.be.dto.community.Community;
import com.example.be.dto.community.CommunityComment;
import com.example.be.service.community.CommunityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @GetMapping("wholeList/{email}")
    @PreAuthorize("isAuthenticated()")
    public List<Map<String, Object>> wholeList(@PathVariable String email) {
        return service.wholeList(email);
    }


    @PostMapping("write")
    @PreAuthorize("isAuthenticated()")
    public void write(Community community, @RequestParam(value = "files[]", required = false) MultipartFile[] files, Authentication auth) {
        service.write(community, files, auth);
    }

    @GetMapping("view/{id}")
    public Map<String, Object> view(@PathVariable Integer id) {
        return service.view(id);
    }

    @PutMapping("edit")
    @PreAuthorize("isAuthenticated()")
    public void edit(Community community,
                     @RequestParam(defaultValue = "0", value = "removeFiles[]", required = false) List<Integer> removeFiles,
                     @RequestParam(value = "uploadFiles[]", required = false) MultipartFile[] uploadFiles,
                     Authentication auth) {
        service.edit(community, removeFiles, uploadFiles, auth);
    }

    @DeleteMapping("delete/{id}")
    @PreAuthorize("isAuthenticated()")
    public void delete(@PathVariable Integer id, Authentication auth) {
        service.delete(id, auth);
    }

//    TODO :  게시판 댓글 기능

    @PostMapping("comment/write")
    @PreAuthorize("isAuthenticated()")
    public void commentWrite(@RequestBody CommunityComment communityComment, Authentication auth) {

        service.commentWrite(communityComment, auth);
    }

    @DeleteMapping("comment/delete/{id}")
    @PreAuthorize("isAuthenticated()")
    public void commentDelete(@PathVariable Integer id, Authentication auth) {
        System.out.println(id);
        service.commentDelete(id, auth);
    }

    @PutMapping("comment/edit/{id}")
    @PreAuthorize("isAuthenticated()")
    public void commentEdit(@RequestBody CommunityComment communityComment, @PathVariable Integer id, Authentication auth) {
        service.updateComment(communityComment, id, auth);
    }

//    TODO : 게시판 좋아요 기능


}
