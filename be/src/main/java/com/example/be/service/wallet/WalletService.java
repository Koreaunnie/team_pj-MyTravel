package com.example.be.service.wallet;

import com.example.be.dto.wallet.Wallet;
import com.example.be.mapper.wallet.WalletMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class WalletService {
    final WalletMapper mapper;

    // 내 지갑 지출 / 수입 추가
    public boolean add(Wallet wallet) {
        int cnt = mapper.insertWallet(wallet);
        return cnt == 1;
    }

    // 내 지갑 내역 보기
    public List<Wallet> list(Authentication authentication) {
        String writer = authentication.getName();

        return mapper.selectAllByDate(writer);
    }

    // 내 지갑 내역 상세 보기, 수정
    public Wallet view(int id, Authentication authentication) {
        String writer = authentication.getName();
        return mapper.selectById(id, writer);
    }

    // 내 지갑 내역 상세 보기 화면에서 수정
    public boolean update(int id, Wallet wallet) {
        wallet.setId(id);

        // 수입 / 지출이 null 일 경우 0
        if (wallet.getIncome() == null) {
            wallet.setIncome(0);
        }
        if (wallet.getExpense() == null) {
            wallet.setExpense(0);
        }

        int cnt = mapper.update(wallet);
        return cnt == 1;
    }

    // 내 지갑 내역 삭제
    public void delete(int id) {
        mapper.deleteById(id);
    }


    // 내 지갑 내용 추가 / 수정 시 카테고리 목록 반환
    public List<String> getCategories() {
        return mapper.getAllCategories();
    }

}
