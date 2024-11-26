package com.example.be.dto.schedule.Plan;

import lombok.Data;

@Data
public class Plan {
    private Integer id;
    private String title;
    private String due;
    private String destination;

    private String date;
    private String schedule;
    private String location;
    private String time;
    private String memo;
}
