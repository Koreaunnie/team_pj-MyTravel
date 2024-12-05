package com.example.be.service.tour;

import com.example.be.dto.tour.Payment;
import com.example.be.mapper.tour.PaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentService {
  final PaymentMapper mapper;

  public void add(Payment payment) {
    mapper.insert(payment);
  }


}
