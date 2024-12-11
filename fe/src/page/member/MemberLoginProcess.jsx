import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { KakaoLogout } from "../../components/login/KakaoLogout.jsx";

export function MemberLoginProcess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    console.log(code);

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
            console.log(tokenData);
            console.log(
              "Authorization 헤더:",
              `Bearer ${tokenData.access_token}`,
            );
            //백엔드 전달
            fetch(`/api/member/login/kakao`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenData.access_token}`,
              },
              body: JSON.stringify({
                accessToken: tokenData.access_token,
                refreshToken: tokenData.resresh_token,
              }),
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
              .catch((error) => console.error("백엔드 호출 실패: ", error));
          } else {
            console.error("token 요청 실패: ", tokenData);
          }
          //로그인 처리 로직(토큰 저장, redirect)
        })
        .catch((error) => console.error("카카오 토큰 요청 실패", error));
    }
  }, [window.location.search]);

  return (
    <>
      로그인 진행중...
      <KakaoLogout />
    </>
  );
}
