package com.example.be.controller.plan;

import com.example.be.dto.plan.Plan;
import com.example.be.service.plan.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/plan")
public class PlanController {
    final PlanService service;

    // 내 여행 추가
    @PostMapping("add")
    public void add(@RequestBody Plan plan) {
        service.add(plan);
    }

    // 내 여행 목록
    @GetMapping("list")
    public List<Plan> list() {
        return service.list();
    }

    // 내 여행 세부사항
    @GetMapping("view/{id}")
    public List<Plan> view(@PathVariable int id) {
        return service.view(id);
    }


}
