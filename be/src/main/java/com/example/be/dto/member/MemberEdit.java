package com.example.be.dto.member;

import lombok.Data;

@Data
public class MemberEdit {
  private String email;
  private String nickname;
  private String password;
  private String oldPassword;
  private String phone;
}
