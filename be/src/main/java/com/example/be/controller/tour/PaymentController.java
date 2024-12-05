package com.example.be.controller.tour;

import com.example.be.dto.tour.Payment;
import com.example.be.service.tour.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/payment")
public class PaymentController {
  final PaymentService service;

  @PostMapping("payment")
  public void payment(@RequestBody Payment payment) {
    service.add(payment);
  }

//  public List<> paymentHistory(){}
}
