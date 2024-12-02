package com.example.be.service.wallet;

import com.example.be.dto.wallet.Wallet;
import com.example.be.mapper.wallet.WalletMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class WalletService {
    final WalletMapper mapper;

    // 내 지갑 지출 / 수입 추가
    public void add(Wallet wallet) {

        mapper.insertWallet(wallet);
    }

    // 내 지갑 내역 보기
    public List<Wallet> list() {
        return mapper.selectAllByDate();
    }

    // 내 지갑 내역 상세 보기, 수정
    public Wallet view(int id) {
        return mapper.selectById(id);
    }

    // 내 지갑 내역 상세 보기 화면에서 수정
    public Wallet update(int id, Wallet wallet) {
        wallet.setId(id);

        // 수입, 지출이 null 일 경우 0
        if (wallet.getIncome() == null) {
            wallet.setIncome(0);
        }
        if (wallet.getExpense() == null) {
            wallet.setExpense(0);
        }

        int cnt = mapper.update(wallet);
        if (cnt != 1) {
            throw new RuntimeException("Failed to update wallet with id: " + id);
        }
        return wallet;
    }
}
