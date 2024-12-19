package com.example.be.dto.member;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KakaoInfo {
    private String nickname;
    private String imageSrc;
    private String name;
    private String phone;
    private String kakaoEmail;
}
