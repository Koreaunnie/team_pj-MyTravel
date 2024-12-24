package com.example.be.controller;

import com.example.be.service.community.CommunityService;
import com.example.be.service.notice.NoticeService;
import com.example.be.service.plan.PlanService;
import com.example.be.service.tour.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/index")
public class IndexController {

    private final PlanService planService;
    private final TourService tourService;
    private final CommunityService communityService;
    private final NoticeService noticeService;

    // 메인 화면에 필요한 일부 list 를 가져오기
    @GetMapping
    public Map<String, Object> getIndex(@RequestParam(value = "keyword", defaultValue = "") String keyword,
                                        Authentication authentication) {
        Map<String, Object> result = new HashMap<>();
        String writer;

        if (authentication != null) {
            writer = authentication.getName();

            result.put("allPlans", planService.all(writer));
            result.put("plans", planService.getMainPagePlans(keyword, writer));
            result.put("tours", tourService.getMainPageTours(keyword));
            result.put("community", communityService.getMainPageCommunity(keyword));
            result.put("notice", noticeService.getMainPageNotice());
            return result;
        } else {
            result.put("allPlans", List.of());
            result.put("plans", List.of());
            result.put("tours", tourService.getMainPageTours(keyword));
            result.put("community", communityService.getMainPageCommunity(keyword));
            result.put("notice", noticeService.getMainPageNotice());
            return result;
        }
    }
}
