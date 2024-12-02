package com.example.be.controller.tour;

import com.example.be.dto.tour.TourList;
import com.example.be.service.tour.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/cart")
public class CartController {
  final CartService service;

  @DeleteMapping("delete/{id}")
  public ResponseEntity<Map<String, Object>> delete(@PathVariable int id) {
    if (service.delete(id)) {
      return ResponseEntity.ok(Map.of("message", "success"));
    } else {
      return ResponseEntity.ok(Map.of("message", "fail"));
    }
  }

  @GetMapping("list")
  public List<TourList> list(Authentication auth) {
    return service.list(auth);
  }
}
