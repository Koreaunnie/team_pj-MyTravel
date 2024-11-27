package com.example.be.mapper.tour;

import com.example.be.dto.tour.Tour;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface TourMapper {

    @Insert("""
            INSERT INTO tour
            (title, product, price, content, writer)
            VALUES (#{title}, #{product}, #{price}, #{content}, #{writer})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insert(Tour tour);

    @Select("""
            SELECT id, title, product, price FROM tour
            ORDER BY inserted DESC""")
    List<Tour> selectAll();

    @Select("""
            SELECT *
            FROM tour
            WHERE id=#{id}
            """)
    Tour selectById(int id);
}
