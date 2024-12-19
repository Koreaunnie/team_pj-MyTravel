const REST_API_KEY = import.meta.env.VITE_KAKAO_TEST_KEY;

const redirect_uri = "http://localhost:5173/member/login/process";

const SocialKakao = () => {
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${redirect_uri}&response_type=code&prompt=login`;
  const handleKakaoLogin = () => {
    window.location.href = kakaoURL;
  };

  return (
    <>
      <button onClick={handleKakaoLogin} style={{ cursor: "pointer" }}>
        <img src="https://prj241114-j19121m.s3.ap-northeast-2.amazonaws.com/teamPrj1126/74/kakao_login_medium_narrow.png" />
      </button>
    </>
  );
};

export default SocialKakao;
