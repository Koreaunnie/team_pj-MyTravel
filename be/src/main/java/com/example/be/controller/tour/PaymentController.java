package com.example.be.controller.tour;

import com.example.be.dto.tour.Payment;
import com.example.be.dto.tour.PaymentHistory;
import com.example.be.service.member.MemberService;
import com.example.be.service.tour.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/payment")
public class PaymentController {
    final PaymentService service;
    private final MemberService memberService;

    @GetMapping("list")
    public Map<String, Object> PaymentList(
        @RequestParam(value = "page", defaultValue = "1") Integer page,
        @RequestParam(value = "type", defaultValue = "all") String searchType,
        @RequestParam(value = "key", defaultValue = "") String keyword) {
//        System.out.println("type: " + searchType);
//        System.out.println("key: " + keyword);
        return service.allPayment(page, searchType, keyword);
    }

    @PostMapping("payment")
    public ResponseEntity<Map<String, Object>> completePayment(
        @RequestBody Payment payment) {
        Map<String, Object> response = new HashMap<>();
        if (service.add(payment)) {
            response.put("status", "SUCCESS");
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("list/{email}")
    public List<PaymentHistory> paymentHistory(@PathVariable String email, Authentication auth) {
        if (memberService.hasAccess(email, auth)) {
            return service.myPaymentHistory(email);
        } else {
            return null;
        }
    }
}
