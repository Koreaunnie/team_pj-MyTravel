package com.example.be.service.cs.inquiry.comment;

import com.example.be.dto.cs.inquiry.comment.Comment;
import com.example.be.mapper.cs.inquiry.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {
    final CommentMapper mapper;

    public void add(Comment comment) {
        mapper.insert(comment);
    }
}
