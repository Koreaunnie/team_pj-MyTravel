package com.example.be.controller.tour;

import com.example.be.dto.tour.Tour;
import com.example.be.service.tour.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/cart")
public class CartController {
  final CartService service;

  @GetMapping("list")
  public List<Tour> list(Authentication auth) {
    return service.list(auth);
  }
}
