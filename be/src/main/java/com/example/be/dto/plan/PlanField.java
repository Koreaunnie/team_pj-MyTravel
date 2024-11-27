package com.example.be.dto.plan;

import lombok.Data;

@Data
public class PlanField {
    private Integer id;
    private Integer planId;
    private String date;
    private String schedule;
    private String place;
    private String time;
    private String memo;
}
