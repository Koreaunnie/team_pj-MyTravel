package com.example.be.mapper.plan;

import com.example.be.dto.schedule.Plan.Plan;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface PlanMapper {

    @Insert("""
            INSERT INTO plan
            (title, destination, due, date, schedule, location, time, memo)
            VALUES (#{title}, #{destination}, #{due},  #{date}, #{schedule}, #{location}, #{time}, #{memo})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int inset(Plan plan);

    @Select("""
            SELECT * 
            FROM plan
            ORDER BY inserted DESC;
            """)
    List<Plan> select();
}
