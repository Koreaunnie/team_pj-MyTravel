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

  @PutMapping("edit")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<Map<String, Object>> edit(@RequestBody Review review) {
    if (service.edit(review)) {
      return ResponseEntity.ok().body(Map.of("message",
              Map.of("type", "success", "text", "후기 수정 완료")));
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @DeleteMapping("delete/{reviewId}")
  @PreAuthorize("isAuthenticated()")
  public void remove(@PathVariable Integer reviewId, Authentication auth) {
    service.delete(reviewId);
  }

  @GetMapping("list/{tourId}")
  public List<Review> list(@PathVariable Integer tourId) {
    return service.list(tourId);
  }

  @PostMapping("add")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<Map<String, Object>> add(
          @RequestBody Review review, Authentication auth) {
    if (service.canWriteReview(review, auth)) {
      service.add(review, auth);
      return ResponseEntity.ok().body(Map.of("message",
              Map.of("type", "success", "text", "후기가 등록되었습니다.")));
    } else {
      return ResponseEntity.notFound().build();
    }
  }
}
