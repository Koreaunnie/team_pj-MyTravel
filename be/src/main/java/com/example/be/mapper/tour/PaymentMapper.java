package com.example.be.mapper.tour;

import com.example.be.dto.tour.Payment;
import com.example.be.dto.tour.PaymentHistory;
import com.example.be.dto.tour.TourList;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PaymentMapper {

  @Insert("""
          INSERT INTO payment
          (payment_id, buyer_email, pay_method, currency, amount ) 
          VALUES (#{paymentId}, #{buyerEmail}, #{payMethod}, #{currency}, #{amount})
          """)
  int insertPayment(Payment payment);

  @Insert("""
          INSERT INTO payment_detail
          (payment_id, tour_id, startDate, endDate, price)
          VALUES (#{paymentId}, #{tour.id}, #{tour.startDate}, #{tour.endDate}, #{tour.price})   
          """)
  int insertDetails(@Param("paymentId") String paymentId, @Param("tour") TourList tour);

  @Delete("""
          DELETE FROM tour_cart
          WHERE tour_id = #{id}
            AND member_email = #{buyer};    
          """)
  int deleteFromCart(Integer id, String buyer);

  @Select("""
          SELECT payment.payment_id, product, location, currency, paid_at, payment_detail.tour_id, startDate, endDate, tour.price, review
          FROM payment RIGHT JOIN payment_detail
          ON payment.payment_id=payment_detail.payment_id
          LEFT JOIN tour ON tour.id=payment_detail.tour_id    
          LEFT JOIN tour_review tr ON tr.payment_id = payment.payment_id AND tr.tour_id = tour.id
          WHERE buyer_email = #{email}
          ORDER BY paid_at DESC;    
          """)
  List<PaymentHistory> myPaymentHistory(String email);

  @Select("""
          SELECT paid_at, buyer_email, p.payment_id, product, pd.price, currency
          FROM payment p
          RIGHT JOIN payment_detail pd ON p.payment_id = pd.payment_id
          LEFT JOIN tour ON tour.id=pd.tour_id
          ORDER BY paid_at DESC;
          """)
  List<PaymentHistory> allPayment();
}
