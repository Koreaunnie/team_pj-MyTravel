package com.example.be.service.cs.faq;

import com.example.be.dto.cs.faq.Faq;
import com.example.be.mapper.cs.faq.FaqMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FaqService {
    final FaqMapper mapper;

    public boolean add(Faq faq) {
        int cnt = 0;
        cnt = mapper.insertFaq(faq);

        return cnt == 1;
    }

    public List<Faq> list() {
        return mapper.selectAll();
    }

    public Faq view(int id) {
        return mapper.selectById(id);
    }

    public boolean update(Faq faq) {
        int cnt = mapper.updateById(faq);
        return cnt == 1;
    }

    public boolean delete(int id) {
        int cnt = mapper.deleteById(id);
        return cnt == 1;
    }

    public List<Faq> getFaq() {
        return mapper.selectFaqForIndex();
    }

    public boolean hasAccess(String email, Authentication auth) {
        return email.equals(auth.getName());
    }

    public boolean isAdmin(Authentication auth) {
        return auth.getAuthorities()
                .stream()
                .map(a -> a.toString())
                .anyMatch(a -> a.equals("SCOPE_admin"));
    }
}
