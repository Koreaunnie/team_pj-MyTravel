package com.example.be.mapper.tour;

import com.example.be.dto.tour.Payment;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PaymentMapper {

  @Insert("""
          INSERT INTO tour_payment
          (tour_id, order_id, member_email, startDate, endDate) 
          VALUES (#{tourId}, #{paymentId}, #{partnerEmail}, #{startDate}, #{endDate})
          """)
  int insert(Payment payment);
}
