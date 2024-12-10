import axios from "axios";
import { useNavigate } from "react-router-dom";

const kakaoLogout = async () => {
  const navigate = useNavigate();

  const TOKEN = localStorage.getItem("token");
  try {
    const datas = await axios.post(
      `https://kapi.kakao.com/v1/user/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );
    localStorage.removeItem("token");
    setIsTokenLogin(false);
    navigate("/");
  } catch (error) {
    console.error("로그아웃 실패", error);
  }
};
