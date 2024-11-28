package com.example.be.controller;

import com.example.be.dto.plan.Plan;
import com.example.be.service.plan.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/index")
public class IndexController {

    private final PlanService planService;

    // 메인 화면에 필요한 일부 plan list 를 가져오기
    @GetMapping
    public List<Plan> index() {
        return planService.getMainPagePlans();
    }
}
