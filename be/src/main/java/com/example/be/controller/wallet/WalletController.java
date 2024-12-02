package com.example.be.controller.wallet;

import com.example.be.service.wallet.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wallet")
public class WalletController {
    final WalletService service;

    // 내 지갑 추가
    @PostMapping("add")
    public void add() {
        service.add();
    }
}
