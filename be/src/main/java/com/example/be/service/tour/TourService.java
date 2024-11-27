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

    public boolean add(Tour tour) {
        int cnt = mapper.insert(tour);
        return cnt == 1;
    }

    public List<Tour> list() {
        return mapper.selectAll();
    }

    public Tour get(int id) {
        return mapper.selectById(id);
    }
}
