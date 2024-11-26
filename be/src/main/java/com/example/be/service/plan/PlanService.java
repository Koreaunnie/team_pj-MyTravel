package com.example.be.service.plan;

import com.example.be.dto.schedule.Plan.Plan;
import com.example.be.mapper.plan.PlanMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class PlanService {
    final PlanMapper mapper;

    public void add(Plan plan) {
        mapper.inset(plan);
    }
}
