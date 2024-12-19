package com.example.be.service.cs.inquiry;

import com.example.be.dto.cs.inquiry.Inquiry;
import com.example.be.mapper.cs.inquiry.InquiryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class InquiryService {
    final InquiryMapper mapper;

    public void add(Inquiry inquiry) {
        mapper.insertInquiry(inquiry);
    }

    public Map<String, Object> list(Integer page, String searchType, String searchKeyword) {
        // SQL 의 LIMIT 키워드에서 사용되는 offset
        Integer offset = (page - 1) * 10;

        // 조회되는 게시물
        List<Inquiry> list = mapper.selectInquiryByPageOffset(offset, searchType, searchKeyword);

        // 전체 게시물 수
        Integer count = mapper.countAll(searchType, searchKeyword);

        return Map.of("list", list, "count", count);
    }

    public Inquiry get(int id) {
        return mapper.selectById(id);
    }

    public boolean update(Inquiry inquiry) {
        int cnt = mapper.updateById(inquiry);
        return cnt == 1;
    }

    public boolean delete(int id, String writer) {
        int cnt = mapper.deleteById(id, writer);
        return cnt == 1;
    }

    public List<Inquiry> getInquiry() {
        return mapper.selectInquiryForIndex();
    }

    // 회원 닉네임 변경 시 문의글 닉네임도 변경
    public boolean updateWriterNickname(Inquiry inquiry) {
        int cnt = mapper.updateWriterNickname(inquiry);
        return cnt == 1;
    }

    // 문의글 답변 달리면 답변 여부 업데이트
    public boolean hasAnswer(int id) {
        int cnt = mapper.updateHasAnswerTrue(id);
        return cnt == 1;
    }
}
