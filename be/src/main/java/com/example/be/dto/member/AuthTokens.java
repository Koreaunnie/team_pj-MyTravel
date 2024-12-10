package com.example.be.dto.member;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthTokens {
  private String accessToken;
  private String refreshToken;
  private String grantType;
  private Long expiresIn;
}
