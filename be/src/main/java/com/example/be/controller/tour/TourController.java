package com.example.be.controller.tour;

import com.example.be.dto.tour.Tour;
import com.example.be.service.member.MemberService;
import com.example.be.service.tour.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/tour")
public class TourController {
  final TourService service;
  final MemberService memberService;

  @PostMapping("cart")
  public ResponseEntity<Map<String, Object>> cart(@RequestBody Tour tour, Authentication authentication) {
    if (service.addCart(tour, authentication)) {
      return ResponseEntity.ok(Map.of("message",
              Map.of("type", "success", "text", "장바구니에 상품 추가")));
    } else {
      return ResponseEntity.status(409).body(Map.of("message",
              Map.of("type", "warning", "text", "이미 장바구니에 담은 상품입니다.")));
    }
  }

  @PutMapping("update")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<Map<String, Object>> update(
          Tour tour, Authentication authentication,
          @RequestParam(value = "removeFiles[]", required = false) List<String> removeFiles,
          @RequestParam(value = "uploadFiles[]", required = false) MultipartFile[] uploadFiles) {
    if (service.hasAccess(tour.getId(), authentication) || memberService.isAdmin(authentication)) {
      if (service.update(tour, removeFiles, uploadFiles)) {
        return ResponseEntity.ok(Map.of("message",
                Map.of("type", "success", "text", "상품 수정 완료")));
      } else {
        return ResponseEntity.badRequest().body(Map.of("message",
                Map.of("type", "warning", "text", "상품 수정 실패")));
      }
    } else {
      return ResponseEntity.status(403).body(
              Map.of("message", Map.of("type", "error", "text", "수정 권한이 없습니다.")));
    }
  }


  @DeleteMapping("delete/{id}")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<Map<String, Object>> delete(
          @PathVariable int id, Authentication authentication) {
    if (service.hasAccess(id, authentication) || memberService.isAdmin(authentication)) {
      if (service.delete(id)) {
        return ResponseEntity.ok().body(Map.of("message",
                Map.of("type", "success", "text", "상품 삭제")));
      } else {
        return ResponseEntity.status(400).body(Map.of("message",
                Map.of("type", "warning", "text", "상품 수정 실패")));
      }
    } else {
      return ResponseEntity.status(403).body(
              Map.of("message", Map.of("type", "error", "text", "삭제 권한이 없습니다.")));
    }
  }

  @GetMapping("view/{id}")
  public Tour view(@PathVariable int id) {
    return service.get(id);
  }

  @GetMapping("list")
  public Map<String, Object> list(
          @RequestParam(value = "type", defaultValue = "all") String searchType,
          @RequestParam(value = "key", defaultValue = "") String keyword
  ) {
    return service.list(searchType, keyword);
  }

  @PostMapping("add")
  @PreAuthorize("hasAuthority('SCOPE_partner')")
  public ResponseEntity<Map<String, Object>> add(
          Tour tour,
          @RequestParam(value = "files[]", required = false) MultipartFile[] files,
          Authentication authentication) {

    if (service.isPartner(authentication)) {
      try {
        if (!service.validate(tour)) {
          return ResponseEntity.badRequest().body(Map.of("message",
                  Map.of("type", "warning", "text", "미완성 폼입니다.")));
        } else {
          if (service.add(tour, files, authentication)) {
            return ResponseEntity.ok().body(Map.of("message",
                    Map.of("type", "success", "text", "상품이 등록되었습니다."),
                    "data", tour));
          } else {
            return ResponseEntity.badRequest().body(Map.of("message",
                    Map.of("type", "warning", "text", "상품을 등록하지 못했습니다.")));
          }
        }
      } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("message",
                Map.of("type", "warning", "text", "상품을 등록 실패")));
      }
    } else {
      return ResponseEntity.status(401).body(Map.of("message",
              Map.of("type", "warning", "text", "상품 등록 권한이 없습니다.")));
    }
  }
}
