package com.example.be.service.cs.faq;

import com.example.be.dto.cs.faq.Faq;
import com.example.be.mapper.cs.faq.FaqMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FaqService {
    final FaqMapper mapper;

    public void add(Faq faq) {
        mapper.insertFaq(faq);
    }

    public List<Faq> list() {
        return mapper.selectAll();
    }
}
