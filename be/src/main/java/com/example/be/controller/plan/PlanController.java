package com.example.be.controller.plan;

import com.example.be.dto.plan.Plan;
import com.example.be.service.plan.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/plan")
public class PlanController {
    final PlanService service;

    // 내 여행 추가
    @PostMapping("add")
    public ResponseEntity<Map<String, Object>> add(@RequestBody Plan plan) {
        try {
            if (service.add(plan)) {
                return ResponseEntity.ok().body(Map.of(
                        "message", Map.of("type", "success",
                                "text", "여행이 저장되었습니다."),
                        "id", plan.getId())); // 자동 생성된 id 응답으로 보내기
            } else {
                return ResponseEntity.internalServerError().body(Map.of(
                        "message", Map.of("type", "warning",
                                "text", "여행이 저장 중 문제가 발생하였습니다.")));
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // 내 여행 목록 조회
    @GetMapping("list")
    public Map<String, Object> list(@RequestParam(value = "page", defaultValue = "1") Integer page) {
        return service.list(page);
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
