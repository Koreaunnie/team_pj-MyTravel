export function KakaoLogout() {
  const handleKakaoLogout = async () => {
    const accessToken = localStorage.getItem("token");

    fetch("https://kapi.kakao.com/v1/user/unlink", {
      method: "POST",
      headers: {
        Authorization: `KakaoAK ${process.env.VITE_KAKAO_ADMIN_KEY}`, // 앱 어드민 키
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: new URLSearchParams({
        target_id_type: "user_id", // 고정 값
        target_id: "aro19121@naver.com", // 연결을 끊을 사용자의 회원번호
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("연결 해제 성공:", data);
      })
      .catch((error) => console.error("연결 해제 실패:", error));
  };
  return (
    <>
      <button onClick={handleKakaoLogout} className={"btn btn-warning"}>
        로그아웃
      </button>
    </>
  );
}
