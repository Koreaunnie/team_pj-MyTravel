import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { KakaoLogout } from "../../components/login/KakaoLogout.jsx";
import axios from "axios";

export function MemberLoginProcess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");

    //백엔드에 인증 코드 전달
    if (code) {
      const data = new URLSearchParams();
      data.append("grant_type", "authorization_code");
      data.append("client_id", import.meta.env.VITE_KAKAO_LOGIN_API_KEY); // REST API 키
      data.append("redirect_uri", "http://localhost:5173/member/login/process"); // 리다이렉트 URI
      data.append("code", code); // 인가 코드

      //카카오에 토큰 요청
      fetch("https://kauth.kakao.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        //요청 본문
        body: data.toString(),
      })
        .then((res) => res.json())
        .then((tokenData) => {
          if (tokenData.access_token) {
            //accessToken 저장
            localStorage.setItem("accessToken", tokenData.access_token);
            // console.log(tokenData);
            // console.log(
            //   "Authorization 헤더:",
            //   `Bearer ${tokenData.access_token}`,
            // );

            fetch("https://kapi.kakao.com/v2/user/me", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            })
              .then((res) => res.json())
              .then((userInfo) => {
                const nickname = userInfo.kakao_account.profile.nickname;
                const imageSrc =
                  userInfo.kakao_account.profile.profile_image_url;

                console.log("Nickname:", nickname);
                console.log("Profile Image URL:", imageSrc);

                //백엔드 전달
                axios
                  .post(`/api/member/login/kakao`, {
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token,
                    expiresIn: tokenData.expires_in,
                    nickname,
                    imageSrc,
                    tokenType: tokenData.brearer,
                  })
                  .then((r) => {
                    if (!r.ok) {
                      console.error(`HTTP 에러: ${r.status} ${r.statusText}`);
                      throw new Error("HTTP 에러 발생");
                    }
                    return r.json();
                  })
                  .then((userData) => {
                    console.log("사용자 데이터", userData);
                  })
                  .catch((error) => {
                    console.error("백엔드 호출 실패:", error);
                  });
              })
              .catch((error) => {
                console.error("카카오 사용자 정보 요청 실패:", error);
              });
          } else {
            console.error("토큰 요청 실패:", tokenData);
          }
        })
        .catch((error) => console.error("카카오 토큰 요청 실패:", error));
    }
  }, [window.location.search]);

  return (
    <>
      로그인 진행중...
      <KakaoLogout />
    </>
  );
}
