package com.example.be.mapper.wallet;

import com.example.be.dto.wallet.Wallet;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface WalletMapper {

    // 내 지갑 지출 / 수입 추가
    @Insert("""
            INSERT INTO wallet(
                    date, category, title, income, expense, payment_method, memo)
            VALUES (#{date}, #{category}, #{title}, #{income}, #{expense}, #{paymentMethod}, #{memo})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insertWallet(Wallet wallet);

    // 내 지갑 내역 보기
    @Select("""
            SELECT * 
            FROM wallet
            ORDER BY date
            """)
    List<Wallet> selectAllByDate();

    // 내 지갑 내역 상세 보기
    @Select("""
            select *
            FROM wallet
            WHERE id = #{id}
            """)
    Wallet selectById(int id);

    // 내 지갑 내역 상세 보기 화면에서 수정
    @Update("""
            update wallet
            SET date = #{date},
                category = #{category},
                title = #{title},
                income = #{income},
                expense = #{expense},
                payment_method = #{paymentMethod},
                memo = #{memo}
            WHERE id = #{id}
            """)
    int update(Wallet wallet);


}
