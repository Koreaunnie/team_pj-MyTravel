package com.example.be.service.tour;

import com.example.be.dto.tour.Tour;
import com.example.be.mapper.tour.TourMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class TourService {
    final TourMapper mapper;

    public void add(Tour tour) {
        mapper.insert(tour);
    }

    public List<Tour> list() {
        return mapper.selectAll();
    }
}
