package com.example.be.mapper.plan;

import com.example.be.dto.plan.Plan;
import com.example.be.dto.plan.PlanField;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface PlanMapper {

    // 1. plan header 항목 추가
    @Insert("""
            INSERT INTO plan
                (inserted, title, description, destination, due)
            VALUES 
                (NOW(), #{title}, #{description}, #{destination}, #{due})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insertPlan(Plan plan);

    // 2. plan body 항목 추가
    @Insert("""
            INSERT INTO plan_field
                (plan_id, date, schedule, place, time, memo)
            VALUES 
                (#{planId}, #{date}, #{schedule}, #{place}, #{time}, #{memo})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insertPlanField(PlanField field);

    // 1. plan header 조회
    @Select("""
            SELECT * 
            FROM plan
            ORDER BY inserted DESC;
            """)
    List<Plan> selectPlan();

    // 1. plan body 조회


}
