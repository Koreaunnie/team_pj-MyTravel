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
        SELECT payment.payment_id,
               product,
               w.id     walletId,
               pl.id    planId,
               location,
               currency,
               paid_at,
               pd.tour_id,
               pd.startDate,
               pd.endDate,
               tour.price,
               review,
               pd.id as paymentDetailId
        FROM payment
                 RIGHT JOIN payment_detail pd
                            ON payment.payment_id = pd.payment_id
                 LEFT JOIN tour ON tour.id = pd.tour_id
                 LEFT JOIN tour_review tr ON tr.payment_id = payment.payment_id AND tr.tour_id = tour.id
                 LEFT JOIN wallet w ON w.payment_detail_id = pd.id
                 LEFT JOIN plan pl ON pl.payment_detail_id = pd.id
        WHERE buyer_email = #{email}
        ORDER BY paid_at DESC;    
        """)
    List<PaymentHistory> myPaymentHistory(String email);

    @Select("""
        <script>
        SELECT paid_at, buyer_email, p.payment_id as paymentId, product, pd.price, currency
        FROM payment p
        RIGHT JOIN payment_detail pd ON p.payment_id = pd.payment_id
        LEFT JOIN tour ON tour.id=pd.tour_id
        WHERE 
            <trim prefixOverrides="OR">
                <if test="searchType=='all' or searchType=='buyerEmail'">
                    buyer_email LIKE CONCAT('%', #{keyword}, '%')
                </if>            
                <if test="searchType == 'all' or searchType == 'paymentId'">
                    OR p.payment_id LIKE CONCAT('%', #{keyword}, '%')
                </if>
                <if test="searchType == 'all' or searchType == 'product'">
                    OR product LIKE CONCAT('%', #{keyword}, '%')
                </if>      
            </trim>
        ORDER BY paid_at DESC
        LIMIT #{offset}, 10
        </script>
        """)
    List<PaymentHistory> allPayment(Integer offset, String searchType, String keyword);

    @Select("""
            <script>
            SELECT COUNT(*)
            FROM payment p
            RIGHT JOIN payment_detail pd ON p.payment_id = pd.payment_id
            LEFT JOIN tour ON tour.id=pd.tour_id
            WHERE 
                <trim prefixOverrides="OR">
                    <if test="searchType=='all' or searchType=='buyerEmail'">
                        buyer_email LIKE CONCAT('%', #{keyword}, '%')
                    </if>            
                    <if test="searchType == 'all' or searchType == 'paymentId'">
                        OR pd.payment_id LIKE CONCAT('%', #{keyword}, '%')
                    </if>
                    <if test="searchType == 'all' or searchType == 'product'">
                        OR product LIKE CONCAT('%', #{keyword}, '%')
                    </if>      
                </trim>
            </script>
        """)
    Integer countPayment(String searchType, String keyword);
}
