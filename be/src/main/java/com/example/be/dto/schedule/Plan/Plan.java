package com.example.be.dto.schedule.Plan;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Plan {
    private Integer id;
    private LocalDateTime inserted;

    private String title;
    private String destination;
    private String due;

    private String date;
    private String schedule;
    private String location;
    private String time;
    private String memo;
}
