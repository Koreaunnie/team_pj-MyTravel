package com.example.be.service.cs.faq;

import com.example.be.dto.cs.faq.Faq;
import com.example.be.mapper.cs.faq.FaqMapper;
import com.example.be.mapper.member.MemberMapper;
import com.example.be.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class FaqService {
    final FaqMapper mapper;
    final MemberMapper memberMapper;
    final MemberService memberService;

    public boolean add(Faq faq, Authentication authentication) {
        String userNickname = memberMapper.selectNicknameByEmail(authentication.getName());
        faq.setWriter(userNickname);

        int cnt = 0;
        cnt = mapper.insertFaq(faq);

        return cnt == 1;
    }

    public Map<String, Object> list(Integer page, String type, String keyword) {
        Integer offset = (page - 1) * 10;

        //list 조회
        List<Faq> faqList = mapper.searchResult(offset, type, keyword);

        //조회 결과 수
        Integer count = mapper.countAll(type, keyword);

        if (faqList == null || faqList.isEmpty()) {
            return Map.of("faqList", List.of());
        }

        return Map.of("faqList", faqList, "count", count);
//        return mapper.selectAll();
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
