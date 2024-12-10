import { useEffect } from "react";

const REST_API_KEY = import.meta.env.VITE_KAKAO_LOGIN_API_KEY;

const redirect_uri = "http://localhost:5173";

const SocialKakao = () => {
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${redirect_uri}&response_type=code`;
  const handleKakaoLogin = () => {
    window.location.href = kakaoURL;
  };

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      fetch(`/api/member/login/oauth.kakao`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        params: { code },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("로그인 성공: ", data);
          //로그인 처리 로직
        })
        .catch((error) => console.error("로그인 실패:", error));
    }
  }, []);

  return (
    <>
      <button onClick={handleKakaoLogin}>카카오 로그인</button>
    </>
  );
};

export default SocialKakao;
