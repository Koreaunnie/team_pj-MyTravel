package com.example.be.controller.plan;

import com.example.be.dto.schedule.Plan.Plan;
import com.example.be.service.plan.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("plan")
public class PlanController {
    final PlanService service;

    // 일정 추가
    @RequestMapping("add")
    public void add(Plan plan) {
        service.add(plan);
        System.out.println(plan);
    }
}
