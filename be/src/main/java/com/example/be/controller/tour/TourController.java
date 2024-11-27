package com.example.be.controller.tour;

import com.example.be.dto.tour.Tour;
import com.example.be.service.tour.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/tour")
public class TourController {
    final TourService service;

    @GetMapping("list")
    public List<Tour> list() {
        return service.list();
    }

    @PostMapping("add")
    public void add(@RequestBody Tour tour) {
        service.add(tour);
    }

}
