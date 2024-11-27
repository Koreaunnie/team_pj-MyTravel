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
        if (service.add(tour)) {
            return ResponseEntity.ok().body(Map.of("message",
                    Map.of("type", "success", "text", "상품이 등록되었습니다."),
                    "data", tour));
        } else {
            return ResponseEntity.internalServerError().body(Map.of("message",
                    Map.of("type", "warning", "text", "상품을 등록하지 못했습니다.")));
        }
    }

}
