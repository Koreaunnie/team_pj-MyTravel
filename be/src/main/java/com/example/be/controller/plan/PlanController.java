package com.example.be.controller.plan;

import com.example.be.dto.plan.Plan;
import com.example.be.service.member.MemberService;
import com.example.be.service.plan.PlanService;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
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
                                    @RequestParam(value = "sk", defaultValue = "") String searchKeyword,
                                    Authentication authentication) {
        String writer = authentication.getName();
        System.out.println(searchKeyword);
        return service.list(page, searchType, searchKeyword, writer);
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
    public Map<String, Object> view(@PathVariable int id, Authentication authentication) {
        String writer = authentication.getName();
        return service.view(id, writer);
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
        String writer = authentication.getName();
        Map<String, Object> result = service.view(id, writer);
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

    // 내 여행 엑셀 파일 다운로드
    @PostMapping("view/saveExcel/{id}")
    public void saveExcel(@PathVariable("id") int id,
                          Authentication authentication,
                          HttpServletResponse response) {
        String writer = authentication.getName();
        Workbook workbook = service.getPlanToSaveExcel(id, writer);  // Excel 워크북 생성

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=\"my_plan.xlsx\"");

        try (ServletOutputStream outputStream = response.getOutputStream()) {
            // Excel 파일을 직접 스트리밍 방식으로 전송
            workbook.write(outputStream);
        } catch (IOException e) {
            e.printStackTrace();
            try {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "파일 생성 중 오류가 발생했습니다.");
            } catch (IOException ioException) {
                ioException.printStackTrace();
            }
        } finally {
            try {
                workbook.close();  // Workbook 자원 해제
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    // 달력에 표시하기 위한 모든 일정 (페이지네이션 상관 없이)
    @GetMapping("all")
    public List<Plan> all(Authentication authentication) {
        String writer = authentication.getName();
        return service.all(writer);
    }
}
