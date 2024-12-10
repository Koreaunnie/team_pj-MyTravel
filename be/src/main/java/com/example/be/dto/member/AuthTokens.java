package com.example.be.dto.member;

import lombok.Data;

@Data
public class AuthTokens {
  private String accessToken;
  private String refreshToken;
  private String grantType;
  private Long expiresIn;

  public AuthTokens(String accessToken, String refreshToken) {
  }
}
