package com.example.be.controller.tour;

import com.example.be.dto.tour.PaymentHistory;
import com.example.be.dto.tour.Review;
import com.example.be.service.tour.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {
    final ReviewService service;

    @GetMapping("view/{reviewId}")
    public Review view(@PathVariable int reviewId) {
        return service.get(reviewId);
    }

    @GetMapping("payment/{tourId}")
    public List<PaymentHistory> paymentList(@PathVariable Integer tourId, Authentication auth) {
        List<PaymentHistory> paidList = service.paymentList(tourId, auth);
//    System.out.println(paidList);
        return paidList;
    }

    @GetMapping(value = "check", params = "tourId")
    public ResponseEntity<Map<String, Object>> checkPayment(@RequestParam Integer tourId, Authentication auth) {
        if (service.canWriteReview(tourId, auth)) {
            return ResponseEntity.ok().body(Map.of("available", true));
        } else {
            return ResponseEntity.ok().body(Map.of("available", false));
        }
    }

    @PutMapping("edit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> edit(@RequestBody Review review) {
        System.out.println("수정 내용" + review);
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
        @RequestParam(value = "reviewImg[]", required = false) MultipartFile[] reviewImg,
        Review review, Authentication auth) {
        Integer currentTour = review.getTourId();

        if (service.canWriteReview(currentTour, auth)) {
            service.add(review, auth, reviewImg);
            return ResponseEntity.ok().body(Map.of("message",
                Map.of("type", "success", "text", "후기가 등록되었습니다.")));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
