package com.example.be.service.plan;

import com.example.be.dto.plan.Plan;
import com.example.be.dto.plan.PlanField;
import com.example.be.mapper.plan.PlanMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class PlanService {
    final PlanMapper mapper;

    // 내 여행 추가
    // 1. 여행 저장
    public boolean add(Plan plan) {
        // 1. Plan 의 기본 정보 저장 (ID 생성)
        int cnt = mapper.insertPlan(plan);

        // 2. plan body fields 데이터를 반복적으로 저장
        if (plan.getPlanFieldList() != null) {
            for (PlanField field : plan.getPlanFieldList()) {
                // plan 의 id 를 PlanField 에서 참조
                field.setPlanId(plan.getId());

                // 여행 추가 시 날짜 입력되지 않았을 때 NULL로 처리
                if (field.getDate() == null || field.getDate().isEmpty()) {
                    field.setDate(null);
                }

                // 여행 추가 시 시간이 입력되지 않았을 때 NULL로 처리
                if (field.getTime() == null || field.getTime().isEmpty()) {
                    field.setTime(null);
                }

                // PlanField 에 저장
                mapper.insertPlanField(field);
            }
        }
        return cnt == 1;
    }

    // 2. 여행 저장 시여행 제목이 공백이 아니고 길이가 1자 이상인 경우에만 true
    public boolean validate(Plan plan) {
        return plan.getTitle() != null && !plan.getTitle().trim().isEmpty();
    }

    // 내 여행 목록 조회
    public Map<String, Object> list(Integer page, String searchType, String searchKeyword) {
        // SQL 의 LIMIT 키워드에서 사용되는 offset
        Integer offset = (page - 1) * 10;

        // 조회되는 게시물
        List<Plan> list = mapper.selectPlanByPageOffset(offset, searchType, searchKeyword);

        // 전체 게시물 수
        Integer count = mapper.countAll(searchType, searchKeyword);

        return Map.of("list", list, "count", count);
    }

    // 내 여행 세부사항
    public Map<String, Object> view(int id) {
        // Plan 객체 조회
        Plan plan = mapper.selectPlanById(id);
        // 해당 Plan 에 대한 PlanField 목록을 조회
        List<PlanField> planFields = mapper.selectPlanFieldsByPlanId(id);

        // 결과를 Map 에 담아서 변환
        Map<String, Object> result = new HashMap<>();
        result.put("plan", plan);
        result.put("planFields", planFields);

        return result;
    }

    // 내 여행 수정
    public Map<String, Object> update(Plan plan) {
        System.out.println(plan);
        // Plan 객체 수정
        int cntPlan = mapper.updatePlanById(plan);
        // 해당 Plan 에 대한 PlanField 목록 수정
        for (PlanField field : plan.getPlanFieldList()) {
            mapper.updatePlanFieldByPlanId(field);
        }

        // 결과를 담을 Map 객체 생성
        Map<String, Object> result = new HashMap<>();

        // 수정되었을 경우
        if (cntPlan == 1) {
            result.put("success", true);
        } else {
            result.put("success", false);
        }
        return result;
    }

    public void delete(int id) {
        mapper.deleteById(id);
    }

    // 메인 화면에 필요한 일부 plan 리스트 가져오기
    public List<Plan> getMainPagePlans() {
        // 최신 4개의 계획만
        return mapper.getTop4ByOrderByUpdated();
    }

    // 내 여행 달력으로 보기
    public List<Plan> calendar() {
        return mapper.selectByDate();
    }
}
