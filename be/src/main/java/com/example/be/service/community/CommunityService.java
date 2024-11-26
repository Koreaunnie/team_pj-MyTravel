package com.example.be.service.community;

import com.example.be.dto.Community;
import com.example.be.mapper.community.CommunityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommunityService {

    final CommunityMapper mapper;

    public void list(Integer page) {
        mapper.listUp(page);
    }

    public void write(Community community) {

        mapper.writeCommunity(community);
    }

    public void view(Integer id) {
        mapper.viewCommunity(id);
    }

    public void edit(Community community) {
        mapper.editCommunity(community);
    }
}
