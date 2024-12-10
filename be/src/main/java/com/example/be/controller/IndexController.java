package com.example.be.controller;

import com.example.be.service.plan.PlanService;
import com.example.be.service.tour.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
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
    public Map<String, Object> getIndex(@RequestParam(value = "keyword", defaultValue = "") String keyword,
                                        Authentication authentication) {
        Map<String, Object> result = new HashMap<>();

        String writer = authentication.getName();

        result.put("plans", planService.getMainPagePlans(keyword, writer));
        result.put("tours", tourService.getMainPageTours(keyword));
        return result;
    }
}
