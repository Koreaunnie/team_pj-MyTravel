package com.example.be.tour.tourservice;

import com.example.be.tour.tourmapper.TourMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class TourService {

    final TourMapper mapper;

}
