package com.example.be.service.plan;

import com.example.be.dto.schedule.Plan.Plan;
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

    // 일정 추가
    public void add(Plan plan) {
        mapper.inset(plan);
    }

    // 일정 목록
    public List<Plan> list() {
        return mapper.select();
    }
}
