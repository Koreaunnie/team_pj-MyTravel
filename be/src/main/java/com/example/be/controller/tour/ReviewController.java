package com.example.be.controller.tour;

import com.example.be.dto.tour.Review;
import com.example.be.service.tour.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {
  final ReviewService service;

  @GetMapping("list/{tourId}")
  public List<Review> list(@PathVariable Integer tourId) {
    return service.list(tourId);
  }

  @PostMapping("add")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<Map<String, Object>> add(
          @RequestBody Review review, Authentication auth) {
    //TODO: 로그인 권한이 아닌 구매자 권한으로 변경
    service.add(review, auth);
    return ResponseEntity.ok().body(Map.of("message",
            Map.of("type", "success", "text", "새 댓글이 등록되었습니다.")));
  }
}
