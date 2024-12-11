import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { KakaoLogout } from "../../components/login/KakaoLogout.jsx";
import axios from "axios";

export function MemberLoginProcess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      const data = new URLSearchParams();
      data.append("grant_type", "authorization_code");
      data.append("client_id", import.meta.env.VITE_KAKAO_LOGIN_API_KEY); // REST API 키
      data.append("redirect_uri", "http://localhost:5173/member/login/process"); // 리다이렉트 URI
      data.append("code", code); // 인가 코드

      //카카오에 토큰 요청
      axios
        .post("https://kauth.kakao.com/oauth/token", data, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        })
        .then((response) => {
          const tokenData = response.data;
          console.log(tokenData.access_token);
          if (tokenData.access_token) {
            //accessToken storage에 저장 => 고쳐야 함. 이거말고 로그인 정보 token을 보내야지
            localStorage.setItem("accessToken", tokenData.access_token);

            //사용자 정보 요청
            axios
              .post(
                "https://kapi.kakao.com/v2/user/me",
                {},
                {
                  headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                    "Content-Type":
                      "application/x-www-form-urlencoded;charset=utf-8",
                  },
                },
              )
              .then((userResponse) => {
                //사용자 정보 읽기
                const userInfo = userResponse.data;
                const nickname = userInfo.properties.nickname;
                // const imageSrc =
                //   userInfo.kakao_account.profile.profile_image_url;

                console.log("Nickname:", nickname);
                // console.log("Profile Image URL:", imageSrc);

                //백엔드 전달
                axios
                  .post(`/api/member/login/kakao`, {
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token,
                    expiresIn: tokenData.expires_in,
                    nickname,
                    // imageSrc,
                    tokenType: tokenData.token_type,
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
