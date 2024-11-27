package com.example.be.service.community;

import com.example.be.dto.community.Community;
import com.example.be.mapper.community.CommunityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CommunityService {

    final CommunityMapper mapper;

    public List<Map<String, Object>> list(Integer page) {
        return mapper.listUp(page);
    }

    public void write(Community community, Authentication auth) {

        String nickname = mapper.findNickname(auth.getName());
        community.setWriter(nickname);
        mapper.writeCommunity(community);
    }

    public void view(Integer id) {
        mapper.viewCommunity(id);
    }

    public void edit(Community community) {
        mapper.editCommunity(community);
    }

    public void delete(Integer id) {
        mapper.deleteCommunity(id);
    }
}
