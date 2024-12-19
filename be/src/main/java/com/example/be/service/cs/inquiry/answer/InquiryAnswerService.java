package com.example.be.service.cs.inquiry.answer;

import com.example.be.dto.cs.inquiry.answer.InquiryAnswer;
import com.example.be.mapper.cs.inquiry.answer.InquiryAnswerMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class InquiryAnswerService {
    final InquiryAnswerMapper mapper;

    public boolean add(InquiryAnswer inquiryAnswer) {
        int cnt = mapper.insert(inquiryAnswer);
        return cnt == 1;
    }

    public List<InquiryAnswer> list(Integer inquiryId) {
        return mapper.selectAll(inquiryId);
    }

    public boolean update(InquiryAnswer inquiryAnswer) {
        int cnt = mapper.updateById(inquiryAnswer);
        return cnt == 1;
    }

    public boolean delete(int id) {
        int cnt = mapper.deleteById(id);
        return cnt == 1;
    }
}
