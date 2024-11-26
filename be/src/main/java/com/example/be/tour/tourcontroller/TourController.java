package com.example.be.tour.tourcontroller;

import com.example.be.tour.tourservice.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("tour")
public class TourController {
    public void tour() {
    }

    final TourService service;


}
