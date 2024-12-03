import React from "react";
import "./common.css";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar(props) {
  const navigate = useNavigate();

  return (
    <nav className={"navbar"}>
      <div className={"user-container"}>
        <ul>
          <li onClick={() => navigate("/member/signup")}>회원가입</li>
          <li onClick={() => navigate("/member/login")}>로그인</li>
          <li
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/member/login");
            }}
          >
            로그아웃
          </li>
        </ul>
      </div>

      <h1 className={"logo"} onClick={() => navigate("/")}>
        My Travel
      </h1>

      <div className={"nav-container"}>
        <ul>
          <li onClick={() => navigate("/plan/list")}>내 여행</li>
          <li onClick={() => navigate("/wallet/list")}>내 지갑</li>
          <li onClick={() => navigate("/tour/list")}>투어</li>
          <li onClick={() => navigate("/community/list")}>커뮤니티</li>
          <li onClick={() => navigate("/cart")}>장바구니</li>
          <li onClick={() => navigate("/")}>좋아요</li>
          <li onClick={() => navigate("/")}>알림</li>
          <li onClick={() => navigate("/")}>팔로우</li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
