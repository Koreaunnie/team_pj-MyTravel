package com.example.be.mapper.wallet;

import com.example.be.dto.wallet.Wallet;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

@Mapper
public interface WalletMapper {

    // 내 지갑 지출 / 수입 추가
    @Insert("""
            INSERT INTO wallet(
                    date, category, title, income, expense, payment_method, memo)
            VALUES (#{date}, #{category}, #{title}, #{income}, #{expense}, #{paymentMethod}, #{memo})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    void insertWallet(Wallet wallet);
}
