package com.example.be.mapper.tour;

import com.example.be.dto.tour.Tour;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TourMapper {

  @Insert("""
          INSERT INTO tour
          (title, product, price, location, content, partner)
          VALUES (#{title}, #{product}, #{price}, #{location}, #{content}, #{partner})
          """)
  @Options(keyProperty = "id", useGeneratedKeys = true)
  int insert(Tour tour);

  @Select("""
          SELECT id, title, product, price, location FROM tour
          ORDER BY inserted DESC""")
  List<Tour> selectAll();

  @Select("""
          SELECT *
          FROM tour
          WHERE id=#{id}
          """)
  Tour selectById(int id);

  @Delete("""
          DELETE FROM tour
          WHERE id=#{id}
          """)
  int deleteById(int id);

  @Update("""
          UPDATE tour
          SET title=#{title}, 
              product=#{product}, 
              price=#{price},
              location=#{location}, 
              content=#{content}
          WHERE id=#{id}
          """)
  int update(Tour tour);

  @Select("""
          SELECT nickname
          FROM member
          WHERE email=#{email}
          """)
  String findNickname(String name);
}
