package com.example.be.service.cs.inquiry;

import com.example.be.dto.cs.inquiry.Inquiry;
import com.example.be.mapper.cs.inquiry.InquiryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class InquiryService {
    final InquiryMapper mapper;

    public void add(Inquiry inquiry) {
        mapper.insertInquiry(inquiry);
    }

    public List<Inquiry> list() {
        return mapper.selectAll();
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
}
