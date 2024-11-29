package com.example.be.dto.member;

import lombok.Data;

import java.util.List;

@Data
public class MemberEdit {
  private String email;
  private String nickname;
  private String password;
  private String oldPassword;
  private String phone;
  private List<MemberPicture> profile;
}
