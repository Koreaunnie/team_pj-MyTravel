package com.example.be.controller.tour;

import com.example.be.dto.tour.Tour;
import com.example.be.service.tour.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/tour")
public class TourController {
  final TourService service;

  @PutMapping("update")
  public ResponseEntity<Map<String, Object>> update(@RequestBody Tour tour) {
    if (service.update(tour)) {
      return ResponseEntity.ok(Map.of("message",
              Map.of("type", "success", "text", "상품 수정 완료")));
    } else {
      return ResponseEntity.ok(Map.of("message",
              Map.of("type", "warning", "text", "상품 수정 실패")));
    }
  }

  @DeleteMapping("delete/{id}")
  public ResponseEntity<Map<String, Object>> delete(@PathVariable int id) {
    if (service.delete(id)) {
      return ResponseEntity.ok().body(Map.of("msg",
              Map.of("type", "success", "text", "상품 삭제")));
    } else {
      return ResponseEntity.ok().body(Map.of("msg",
              Map.of("type", "error", "text", "상품 삭제 실패")));
    }
  }

  @GetMapping("view/{id}")
  public Tour view(@PathVariable int id) {
    return service.get(id);
  }

  @GetMapping("list")
  public List<Tour> list() {
    return service.list();
  }

  @PostMapping("add")
  public ResponseEntity<Map<String, Object>> add(@RequestBody Tour tour) {

    if (service.validate(tour)) {
      if (service.add(tour)) {
        return ResponseEntity.ok().body(Map.of("message",
                Map.of("type", "success", "text", "상품이 등록되었습니다."),
                "data", tour));
      } else {
        return ResponseEntity.internalServerError().body(Map.of("message",
                Map.of("type", "warning", "text", "상품을 등록하지 못했습니다.")));
      }
    } else {
      return ResponseEntity.badRequest().body(Map.of("message",
              Map.of("type", "warning", "text", "제목이나 본문이 비어있을 수 없습니다.")));
    }
  }


}
