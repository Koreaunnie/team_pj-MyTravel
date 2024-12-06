package com.example.be.service.cs;

import com.example.be.dto.cs.inquiry.Inquiry;
import com.example.be.mapper.cs.CsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CsService {
    final CsMapper mapper;

    public void add(Inquiry inquiry) {
        mapper.insertInquiry(inquiry);
    }

    public List<Inquiry> list() {
        return mapper.selectAll();
    }

    public Inquiry get(int id) {
        return mapper.selectById(id);
    }
}
