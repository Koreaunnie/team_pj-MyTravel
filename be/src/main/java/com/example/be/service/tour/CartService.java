package com.example.be.service.tour;

import com.example.be.dto.tour.Tour;
import com.example.be.mapper.tour.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CartService {
  final CartMapper mapper;

  public List<Tour> list(Authentication auth) {
    return mapper.selectAll(auth.getName());
  }
}
