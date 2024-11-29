package com.example.be.dto.member;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class Member {
  private String email;
  private String nickname;
  private String password;
  private String name;
  private String phone;
  private LocalDateTime inserted;
  private List<MemberPicture> profile;
}
