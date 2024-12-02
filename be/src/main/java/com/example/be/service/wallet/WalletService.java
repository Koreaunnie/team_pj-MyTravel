package com.example.be.service.wallet;

import com.example.be.dto.wallet.Wallet;
import com.example.be.mapper.wallet.WalletMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class WalletService {
    final WalletMapper mapper;

    // 내 지갑 지출 / 수입 추가
    public void add(Wallet wallet) {
        
        mapper.insertWallet(wallet);
    }
}
