import { useEffect } from "react";

const REST_API_KEY = import.meta.env.VITE_KAKAO_LOGIN_API_KEY;

const redirect_uri = "http://localhost:5173";

const SocialKakao = () => {
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${redirect_uri}&response_type=code&prompt=login`;
  const handleKakaoLogin = () => {
    window.location.href = kakaoURL;
  };

  useEffect(() => {
    //인증 코드 추출
    const code = new URLSearchParams(window.location.search).get("code");
    console.log("인증코드: ", code);
    //백엔드에 인증 코드 전달
    if (code) {
      const data = new URLSearchParams();
      data.append("grant_type", "authorization_code");
      data.append("client_id", import.meta.env.VITE_KAKAO_LOGIN_API_KEY); // REST API 키
      data.append("redirect_uri", "http://localhost:5173"); // 리다이렉트 URI
      data.append("code", code); // 인가 코드

      fetch("https://kauth.kakao.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        body: data.toString(),
      })
        .then((res) => res.json())
        .then((tokenData) => {
          console.log("토큰응답", tokenData);
          if (tokenData.accessToken) {
            //accessToken 저장
            console.log("액세스 토큰:", tokenData.accessToken);
            localStorage.setItem("accessToken", tokenData.accessToken);

            //추가처리
            fetch(`/api/member/login/kakao`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenData.accessToken}`,
              },
              body: JSON.stringify({
                accessToken: tokenData.accessToken,
              }),
            })
              .then((r) => r.json())
              .then((userData) => {
                console.log("사용자 데이터", userData);
              })
              .catch((error) => console.error("백엔드 호출 실패: ", error));
          }
          //로그인 처리 로직(토큰 저장, redirect)
        })
        .catch((error) => console.error("카카오 토큰 요청 실패", error));
    }
  }, [window.location.search]);

  return (
    <>
      <button onClick={handleKakaoLogin} style={{ cursor: "pointer" }}>
        <img src="https://prj241114-j19121m.s3.ap-northeast-2.amazonaws.com/teamPrj1126/74/kakao_login_medium_narrow.png" />
      </button>
    </>
  );
};

export default SocialKakao;
