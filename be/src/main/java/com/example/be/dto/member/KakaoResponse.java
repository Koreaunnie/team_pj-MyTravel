package com.example.be.dto.member;

import lombok.Data;

@Data
public class KakaoResponse {
  private String name;
  private String email;
  private AuthTokens token;
}
