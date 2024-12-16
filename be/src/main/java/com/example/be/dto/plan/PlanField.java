package com.example.be.dto.plan;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class PlanField {
    private Integer planId;
    private Integer id;
    private LocalDate date;
    private LocalTime time;
    private String schedule;
    private String place;
    private String placeId;
    private String memo;
}
