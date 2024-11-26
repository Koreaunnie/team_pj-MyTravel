package com.example.be.mapper.plan;

import com.example.be.dto.schedule.Plan.Plan;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

@Mapper
public interface PlanMapper {

    @Insert("""
            INSERT INTO plan
            (title, due, destination, date, schedule, location, time, memo)
            VALUES (#{title}, #{due}, #{destination}, #{date}, #{schedule}, #{location}, #{time}, #{memo})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int inset(Plan plan);
}
