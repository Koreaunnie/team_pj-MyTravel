package com.example.be.dto.member;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KakaoResponse {
  private String profileNickname;
  private AuthTokens token;
}
