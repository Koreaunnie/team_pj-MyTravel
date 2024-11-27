package com.example.be.controller.plan;

import com.example.be.dto.plan.Plan;
import com.example.be.service.plan.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/plan")
public class PlanController {
    final PlanService service;

    // 내 여행 추가
    @PostMapping("add")
    public void add(@RequestBody Plan plan) {
        System.out.println(plan);
        service.add(plan);
    }

    // 내 여행 목록
    @GetMapping("list")
    public List<Plan> list() {
        return service.list();
    }

    // 내 여행 세부사항
    @GetMapping("view/{id}")
    public Map<String, Object> view(@PathVariable int id) {
        return service.view(id);
    }

    // 내 여행 수정
    @PutMapping("update")
    public Map<String, Object> update(@RequestBody Plan plan) {
        return service.update(plan);
    }

    // 내 여행 삭제
    @DeleteMapping("delete/{id}")
    public void delete(@PathVariable int id) {
        service.delete(id);
    }

}
