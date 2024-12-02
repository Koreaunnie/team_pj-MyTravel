package com.example.be.mapper.tour;

import com.example.be.dto.tour.Tour;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CartMapper {

  @Select("""
          SELECT id, title, product, price, location
          FROM tour_cart tc
          LEFT JOIN tour t ON t.id = tc.tour_id
          WHERE tc.member_email=#{name};
          """)
  List<Tour> selectAll(String name);
}
