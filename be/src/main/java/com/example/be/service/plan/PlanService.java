package com.example.be.service.plan;

import com.example.be.dto.plan.Plan;
import com.example.be.dto.plan.PlanField;
import com.example.be.mapper.plan.PlanMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class PlanService {
    final PlanMapper mapper;

    // 내 여행 추가
    public void add(Plan plan) {
        // 1. Plan의 기본 정보 저장 (ID 생성)
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
    public List<Plan> view(int id) {
        List<Plan> plan = mapper.selectPlanById(id);
        return plan;
    }
}
