package com.example.be.controller.wallet;

import com.example.be.dto.wallet.Wallet;
import com.example.be.service.wallet.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wallet")
public class WalletController {
    final WalletService service;

    // 내 지갑 지출 / 수입 추가
    @PostMapping("add")
    public void add(@RequestBody Wallet wallet) {
        service.add(wallet);
    }

    // 내 지갑 내역 보기
    @GetMapping("list")
    public List<Wallet> list() {
        return service.list();
    }

    // 내 지갑 내역 상세 보기
    @GetMapping("view/{id}")
    public Wallet view(@PathVariable int id) {
        return service.view(id);
    }
}
