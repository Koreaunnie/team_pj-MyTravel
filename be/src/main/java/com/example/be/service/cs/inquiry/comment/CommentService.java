package com.example.be.service.cs.inquiry.comment;

import com.example.be.dto.cs.inquiry.comment.Comment;
import com.example.be.mapper.cs.inquiry.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {
    final CommentMapper mapper;

    public boolean add(Comment comment) {
        int cnt = mapper.insert(comment);
        return cnt == 1;
    }

    public List<Comment> list(Integer inquiryId) {
        return mapper.selectAll(inquiryId);
    }

    public boolean update(Comment comment) {
        int cnt = mapper.updateById(comment);
        return cnt == 1;
    }

    public boolean delete(int id) {
        int cnt = mapper.deleteById(id);
        return cnt == 1;
    }
}
