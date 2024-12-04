package com.example.be.mapper.tour;

import com.example.be.dto.tour.TourList;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CartMapper {

  @Select("""
          SELECT id, title, product, price, location, ti.name image
          FROM tour_cart tc
          LEFT JOIN tour t ON t.id = tc.tour_id
          LEFT JOIN tour_img ti ON tc.tour_id = ti.tour_id
          WHERE tc.member_email=#{name}
          GROUP BY id;
          """)
  List<TourList> selectAll(String name);

  @Delete("""
          DELETE FROM tour_cart
          WHERE tour_id = #{id}
          """)
  int deleteById(int id);
}
