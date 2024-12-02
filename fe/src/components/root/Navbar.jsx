import React from "react";
import "./common.css";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";

// navbar 디자인
function NavbarItem(props) {
  return (
    <Box
      css={{
        paddingX: "15px",
        paddingY: "10px",
      }}
      _hover={{
        boxShadow: "inset 0 -2px 0 #18181b",
        cursor: "pointer",
        fontWeight: "bold",
      }}
      {...props}
    >
      {props.children}
    </Box>
  );
}

function Navbar(props) {
  const navigate = useNavigate();

  return (
    <nav>
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
        <NavbarItem onClick={() => navigate("/plan/list")}>내 여행</NavbarItem>
        <NavbarItem onClick={() => navigate("/tour/list")}>투어</NavbarItem>
        <NavbarItem onClick={() => navigate("/community/list")}>
          커뮤니티
        </NavbarItem>
        <NavbarItem onClick={() => navigate("/wallet/add")}>내 지갑</NavbarItem>
        <NavbarItem onClick={() => navigate("/")}>좋아요</NavbarItem>
        <NavbarItem onClick={() => navigate("/")}>장바구니</NavbarItem>
        <NavbarItem onClick={() => navigate("/")}>알림</NavbarItem>
        <NavbarItem onClick={() => navigate("/")}>팔로우</NavbarItem>
      </div>
    </nav>
  );
}

export default Navbar;
