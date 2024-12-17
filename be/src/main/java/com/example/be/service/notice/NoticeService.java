package com.example.be.service.notice;

import com.example.be.dto.notice.Notice;
import com.example.be.mapper.notice.NoticeMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoticeService {
    final NoticeMapper mapper;
    final S3Client s3;

    public Map<String, Object> list(Integer page, String searchType, String searchKeyword) {

        Integer pageList = (page - 1) * 10;

//        모든 수를 세는 것을 만들어야 함

        List<Notice> list = mapper.listUp(pageList, searchType, searchKeyword);
        for (Notice notice : list) {
            Integer countLikes = mapper.countLikesByNoticeId(notice.getId());
            if (countLikes != null) {
                notice.setNumberOfLikes(countLikes);
            } else {
                notice.setNumberOfLikes(0);
            }
            Integer countViews = mapper.checkViews(notice.getId());
            notice.setNumberOfViews(countViews);
        }

        Integer countNotice = mapper.countAllNotice(searchType, searchKeyword);

        return Map.of("list", list, "countNotice", countNotice);
    }

    public Map<String, Object> view(Integer id, Authentication auth) {

        Map<String, Object> viewer = mapper.viewNotice(id);
        Integer countLike = mapper.countLikesByNoticeId(id);
        viewer.put("like", countLike);
        // 공지사항 좋아요 수

        boolean myNoticeLike;
        if (auth != null) {
            String person = mapper.findNickname(auth.getName());
            if (mapper.findLikeByIdAndNickname(id, person) == 1) {
                myNoticeLike = true;
                viewer.put("myNoticeLike", myNoticeLike);
            } else {
                myNoticeLike = false;
                viewer.put("myNoticeLike", myNoticeLike);
            }
        } else {
            myNoticeLike = false;
            viewer.put("myNoticeLike", myNoticeLike);
        }
        // 로그인 여부와 로그인한 회원 좋아요 여부

        int oldViews = mapper.checkViews(id);
        int views = oldViews + 1;
        mapper.updateViews(views, id);
        viewer.put("views", views);
//        조회수

        return viewer;
    }

    public boolean checkMember(Authentication auth) {
        if (mapper.findNickname(auth.getName()) != null) {
            return true;
        } else {
            return false;
        }
    }

    public boolean checkAdmin(Authentication auth) {
        String myAuth = mapper.findAuth(auth.getName());
        if (myAuth.equals("admin")) {
            return true;
        } else {
            return false;
        }
    }

    public boolean checkNotice(Notice notice) {
        if (notice.getTitle().length() > 0 && notice.getContent().length() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public void write(Notice notice, Authentication auth) {
        String nickname = mapper.findNickname(auth.getName());
        notice.setWriter(nickname);
        mapper.writeNotice(notice);
    }

    public boolean checkRightsOfAccess(Integer id, Authentication auth) {
        String nicknameByAuth = mapper.findNickname(auth.getName());
        String writer = mapper.findNicknameByCommunityId(id);

        return writer.equals(nicknameByAuth);
    }

    public void edit(Notice notice) {
        mapper.editNotice(notice);
    }

    public void delete(Integer id) {

        mapper.deleteLikeByNoticeId(id);

        mapper.deleteNotice(id);
    }

    public boolean checkLikeInNotice(Integer id, Authentication auth) {
        String person = mapper.findNickname(auth.getName());
        int cnt = mapper.findLikeByIdAndNickname(id, person);

        return cnt == 1;
    }

    public void removeLikeInNotice(Integer id, Authentication auth) {
        String person = mapper.findNickname(auth.getName());
        mapper.deleteLikeInNotice(id, person);
    }

    public void addLikeInNotice(Integer id, Authentication auth) {
        String person = mapper.findNickname(auth.getName());
        mapper.InputLikeInNotice(id, person);
    }
}
