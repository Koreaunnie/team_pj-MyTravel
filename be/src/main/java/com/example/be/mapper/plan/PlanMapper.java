package com.example.be.mapper.plan;

import com.example.be.dto.plan.Plan;
import com.example.be.dto.plan.PlanField;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PlanMapper {

    // 내 여행 추가
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
                (plan_id, date, time, schedule, place, memo)
            VALUES 
                (#{planId}, #{date}, #{time}, #{schedule}, #{place}, #{memo})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insertPlanField(PlanField field);

    // 내 여행 목록
    @Select("""
            SELECT * 
            FROM plan
            ORDER BY inserted DESC;
            """)
    List<Plan> selectPlan();

    // 내 여행 세부사항
    // 1. Plan
    @Select("""
            SELECT *
            FROM plan
            WHERE id = #{id};
            """)
    Plan selectPlanById(int id);

    // 2. PlanField
    @Select("""
            SELECT *
            FROM plan_field
            WHERE plan_id = #{id};
            """)
    List<PlanField> selectPlanFieldsByPlanId(int id);

    // 내 여행 수정
    // 1. Plan
    @Update("""
            UPDATE plan 
            SET title=#{title}, 
                description=#{description}, 
                destination=#{destination}, 
                due=#{due},
                updated=NOW()
            WHERE id = #{id};
            """)
    int updatePlanById(Plan plan);

    // 2. PlanField
    @Update("""
            UPDATE plan_field
            SET date=#{date}, 
                time=#{time}, 
                schedule=#{schedule}, 
                place=#{place}, 
                memo=#{memo}
            WHERE id = #{id};
            """)
    int updatePlanFieldByPlanId(PlanField planField);

    @Delete("""
            DELETE FROM plan
            WHERE id = #{id}
            """)
    int deleteById(int id);
}
