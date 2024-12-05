package com.example.be.mapper.tour;

import com.example.be.dto.tour.Tour;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PaymentMapper {

  @Insert("""
          INSERT INTO tour_payment
          (tour_id, member_email) 
          VALUES (#id, #partnerEmail)
          """)
  int insert(Tour tour);
}
