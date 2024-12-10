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
                (inserted, title, description, destination, startDate, endDate, writer)
            VALUES 
                (NOW(), #{title}, #{description}, #{destination}, #{startDate}, #{endDate}, #{writer})
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

    // 내 여행 목록 조회
    // 1. pagination : 한 행에 10개씩 조회
    @Select("""
            <script>
                SELECT * 
                FROM plan p 
                    JOIN plan_field pf 
                    ON p.id = pf.plan_id
               WHERE p.writer = #{writer}
                   <if test="searchKeyword != null and searchKeyword != ''">
                         AND (
                             <trim prefixOverrides="OR">
                                 <if test="searchType == 'all' or searchType == 'title'">
                                     p.title LIKE CONCAT('%', #{searchKeyword}, '%')
                                 </if>
                                 <if test="searchType == 'all' or searchType == 'destination'">
                                     OR p.destination LIKE CONCAT('%', #{searchKeyword}, '%')
                                 </if>
                             </trim>
                         )
                     </if>
                GROUP BY p.id
                ORDER BY p.updated DESC, p.inserted DESC
                LIMIT #{offset}, 10;
            </script>
            """)
    List<Plan> selectPlanByPageOffset(Integer offset, String searchType, String searchKeyword, String writer);

    // 2. pagination : 전체 plan 개수 조회
    @Select("""
            <script>
                SELECT COUNT(*)
                FROM plan 
                WHERE writer = #{writer}
                    <if test="searchKeyword != null and searchKeyword != ''">
                         AND (
                             <trim prefixOverrides="OR">
                                 <if test="searchType == 'all' or searchType == 'title'">
                                     p.title LIKE CONCAT('%', #{searchKeyword}, '%')
                                 </if>
                                 <if test="searchType == 'all' or searchType == 'destination'">
                                     OR p.destination LIKE CONCAT('%', #{searchKeyword}, '%')
                                 </if>
                             </trim>
                         )
                     </if>
            </script>
            """)
    Integer countAll(String searchType, String searchKeyword, String writer);

    // 3. pinned : 상단 고정
    @Update("""
            UPDATE plan 
            SET pinned = NOT pinned 
            WHERE id = #{id}
            """)
    int togglePinned(int id);

    // 내 여행 세부사항
    // 1. Plan
    @Select("""
            SELECT *
            FROM plan
            WHERE id = #{id} AND writer = #{writer};
            """)
    Plan selectPlanById(int id, String writer);

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
                startDate=#{startDate},
                endDate=#{endDate},
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

    // 메인 화면에 필요한 일부 plan 리스트 가져오기
    @Select("""
            <script>
                SELECT *
                FROM plan p 
                    LEFT JOIN plan_field pf
                    ON p.id = pf.plan_id
                WHERE
                    <trim prefixOverrides="OR">
                        p.title LIKE CONCAT('%', #{keyword}, '%')
                        OR p.description LIKE CONCAT('%', #{keyword}, '%')
                        OR p.destination LIKE CONCAT('%', #{keyword}, '%')
                        OR p.startDate LIKE CONCAT('%', #{keyword}, '%')
                        OR p.endDate LIKE CONCAT('%', #{keyword}, '%')
                        OR pf.date LIKE CONCAT('%', #{keyword}, '%')
                        OR pf.time LIKE CONCAT('%', #{keyword}, '%')
                        OR pf.schedule LIKE CONCAT('%', #{keyword}, '%')
                        OR pf.place LIKE CONCAT('%', #{keyword}, '%')
                        OR pf.memo LIKE CONCAT('%', #{keyword}, '%')  
                    </trim>
                GROUP BY p.id
                ORDER BY updated DESC
                LIMIT 4
            </script>
            """)
    List<Plan> getTop4ByOrderByUpdated(String keyword);
}
