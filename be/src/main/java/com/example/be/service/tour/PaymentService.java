package com.example.be.service.tour;

import com.example.be.dto.tour.Payment;
import com.example.be.dto.tour.PaymentHistory;
import com.example.be.dto.tour.TourList;
import com.example.be.mapper.tour.PaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentService {
    final PaymentMapper mapper;

    public boolean add(Payment payment) {
        int cnt;

        cnt = mapper.insertPayment(payment);

        //넘어온 tour를 하나씩 payment_detail에 추가
        Map<Integer, List<TourList>> groupedTours = payment.getTourList().stream()
            .collect(Collectors.groupingBy(TourList::getId));

        groupedTours.forEach((id, tours) -> {
            for (TourList tour : tours) {
                mapper.insertDetails(payment.getPaymentId(), tour);

                //하나씩 cart에서 삭제
                mapper.deleteFromCart(tour.getId(), payment.getBuyerEmail());
            }
        });

        return cnt == 1;
    }


    public List<PaymentHistory> myPaymentHistory(String email) {
        List<PaymentHistory> paidList = mapper.myPaymentHistory(email);

        return paidList;
    }

    public Map<String, Object> allPayment(Integer page, String searchType, String keyword) {
        System.out.println("서비스" + searchType);
        int offset = (page - 1) * 10;

        //paidList
        List<PaymentHistory> paidList = mapper.allPayment(offset, searchType, keyword);

        //개수
        Integer count = mapper.countPayment(searchType, keyword);

        if (paidList == null || paidList.isEmpty()) {
            return Map.of("paidList", List.of());
        }

        return Map.of("paidList", paidList, "count", count);
    }
}
