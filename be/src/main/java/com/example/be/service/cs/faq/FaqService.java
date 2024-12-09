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

    public Faq view(int id) {
        return mapper.selectById(id);
    }

    public void update(Faq faq) {
        mapper.updateById(faq);
    }

    public void delete(int id) {
        mapper.deleteById(id);
    }

    public List<Faq> getFaq() {
        return mapper.selectFaqForIndex();
    }
}
