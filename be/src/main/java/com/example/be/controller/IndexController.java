package com.example.be.controller;

import com.example.be.service.plan.PlanService;
import com.example.be.service.tour.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/index")
public class IndexController {

    private final PlanService planService;
    private final TourService tourService;

    // 메인 화면에 필요한 일부 list 를 가져오기
    @GetMapping
    public ResponseEntity<Map<String, Object>> getIndex(@RequestParam(value = "keyword", defaultValue = "") String keyword) {
        try {
            Map<String, Object> result = new HashMap<>();
            result.put("plans", planService.getMainPagePlans(keyword));
            result.put("tours", tourService.getMainPageTours(keyword));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "서버 에러 발생"));
        }
    }
}
