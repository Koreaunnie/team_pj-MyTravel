package com.example.be.service.cs.faq;

import com.example.be.dto.cs.faq.Faq;
import com.example.be.mapper.cs.faq.FaqMapper;
import com.example.be.service.member.MemberService;
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
    final MemberService memberService;

    public boolean add(Faq faq, Authentication authentication) {
        String userNickname = authentication.getName();
        faq.setWriter(userNickname);

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

    public boolean hasAccess(String email, Authentication authentication) {
        String userEmail = authentication.getName();
        String userNickname = memberService.getNicknameByEmail(userEmail);

        return userNickname.equals(email);
    }
}
