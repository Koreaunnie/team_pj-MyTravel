package com.example.be.controller.tour;

import com.example.be.dto.tour.Payment;
import com.example.be.service.tour.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/payment")
public class PaymentController {
  final PaymentService service;

  @PostMapping("payment")
  public ResponseEntity<Map<String, Object>> completePayment(
          @RequestBody Payment payment) {
    Map<String, Object> response = new HashMap<>();
    if (service.add(payment)) {
      response.put("status", "SUCCESS");
    }
    return ResponseEntity.ok(response);
  }

//  public List<> paymentHistory(){}
}
