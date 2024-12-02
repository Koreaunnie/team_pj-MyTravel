package com.example.be.service.wallet;

import com.example.be.mapper.wallet.WalletMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class WalletService {
    final WalletMapper mapper;

    public void add() {
        mapper.insertWallet();
    }
}
