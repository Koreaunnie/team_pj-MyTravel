import axios from "axios";

export function KakaoLogout() {
  const handleKakaoLogout = async () => {
    const accessToken = localStorage.getItem("accessToken");

    axios
      .post("https://kapi.kakao.com/v1/user/logout", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
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
