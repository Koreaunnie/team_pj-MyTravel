package com.example.be.dto.plan;

import lombok.Data;

@Data
public class PlanField {
    private Integer planId;
    private Integer id;
    private String date;
    private String time;
    private String schedule;
    private String place;
    private String memo;
}
