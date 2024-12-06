package com.example.be.controller.community;

import com.example.be.dto.community.Community;
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
  public List<Map<String, Object>> list(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                        @RequestParam(value = "type", defaultValue = "all") String searchType,
                                        @RequestParam(value = "keyword", defaultValue = "") String searchKeyword) {
    return service.list(page, searchType, searchKeyword);
  }


  @PostMapping("write")
  public void write(
          Community community,
          @RequestParam(value = "files[]", required = false) MultipartFile[] files,
          Authentication auth) {
    System.out.println(files);
    service.write(community, files, auth);
  }

  @GetMapping("view/{id}")
  public Map<String, Object> view(@PathVariable Integer id) {
    return service.view(id);
  }

  @PutMapping("edit")
  public void edit(@RequestBody Community community) {
    System.out.println(community);
    service.edit(community);
  }

  @DeleteMapping("delete/{id}")
  public void delete(@PathVariable Integer id) {
    service.delete(id);
  }

  // TODO : UPDATE 기능 추가


}
