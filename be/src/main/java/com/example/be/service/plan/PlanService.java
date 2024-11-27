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
    public void add(Plan plan) {
        // 1. Plan 의 기본 정보 저장 (ID 생성)
        mapper.insertPlan(plan);

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
    }

    // 내 여행 목록
    public List<Plan> list() {
        return mapper.selectPlan();
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

}
