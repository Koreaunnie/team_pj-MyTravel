package com.example.be.controller.plan;

import com.example.be.dto.plan.Plan;
import com.example.be.service.member.MemberService;
import com.example.be.service.plan.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/plan")
public class PlanController {
    final PlanService service;
    final MemberService memberService;

    // 내 여행 추가
    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> add(@RequestBody Plan plan,
                                                   Authentication authentication) {
        if (service.validate(plan)) {
            if (service.add(plan, authentication)) {
                return ResponseEntity.ok().body(Map.of(
                        "message", Map.of("type", "success",
                                "text", "여행이 저장되었습니다."),
                        "id", plan.getId())); // 자동 생성된 id 응답으로 보내기
            } else {
                return ResponseEntity.internalServerError().body(Map.of(
                        "message", Map.of("type", "warning",
                                "text", "여행이 저장 중 문제가 발생하였습니다.")));
            }
        } else {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", Map.of("type", "warning",
                            "text", "여행명은 비어있을 수 없습니다.")));
        }
    }

    // 내 여행 목록 조회
    @GetMapping("list")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Object> list(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                    @RequestParam(value = "st", defaultValue = "all") String searchType,
                                    @RequestParam(value = "sk", defaultValue = "") String searchKeyword) {
        return service.list(page, searchType, searchKeyword);
    }

    // 내 여행 목록에서 상단 고정
    @PutMapping("pinned/{id}")
    @PreAuthorize("isAuthenticated()")
    public void pinned(@PathVariable int id) {
        service.pinned(id);
    }

    // 내 여행 세부사항
    @GetMapping("view/{id}")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Object> view(@PathVariable int id) {
        return service.view(id);
    }

    // 내 여행 수정
    @PutMapping("update")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Object> update(@RequestBody Plan plan) {
        return service.update(plan);
    }

    // 내 여행 삭제
    @DeleteMapping("delete/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable int id, Authentication authentication) {
        Map<String, Object> result = service.view(id);
        Plan plan = (Plan) result.get("plan");
        String userEmail = plan.getWriter();

        if (memberService.hasAccess(userEmail, authentication)) {
            service.delete(id);
            return ResponseEntity.ok().body(Map.of(
                    "message", Map.of("type", "success", "text", "여행이 삭제되었습니다.")
            ));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "message", Map.of("type", "warning", "text", "권한이 없습니다.")
            ));
        }
    }
}
