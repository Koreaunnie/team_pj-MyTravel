package com.example.be.mapper.wallet;

import com.example.be.dto.wallet.Wallet;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface WalletMapper {

    // 내 지갑 지출 / 수입 추가
    @Insert("""
            INSERT INTO wallet(
                    date, category, title, income, expense, payment_method, memo, inserted, writer)
            VALUES (#{date}, #{category}, #{title}, #{income}, #{expense}, #{paymentMethod}, #{memo}, NOW(), #{writer})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insertWallet(Wallet wallet);

    // 내 지갑 내역 보기
    @Select("""
            SELECT * 
            FROM wallet
            WHERE writer = #{writer}
            ORDER BY date
            """)
    List<Wallet> selectAllByDate(String writer);

    // 내 지갑 내역 상세 보기
    @Select("""
            select *
            FROM wallet
            WHERE id = #{id} AND writer = #{writer}
            """)
    Wallet selectById(int id, String writer);

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

    // 내 지갑 내역 삭제
    @Delete("""
            DELETE FROM wallet
            WHERE id = #{id} AND writer = #{writer}
            """)
    int deleteById(int id, String writer);

    // 내 지갑 내용 추가 / 수정 시 카테고리 목록 반환
    @Select("""
            SELECT DISTINCT category
            FROM wallet
            """)
    List<String> getAllCategories();
}
