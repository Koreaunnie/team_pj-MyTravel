import React from "react";
import "./common.css";
import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";

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
      <Flex
        gap={3}
        mb={4}
        borderBottomWidth="1px"
        borderColor="#ececec"
        bgColor="#f9f9f9"
      >
        <NavbarItem onClick={() => navigate("/")}>HOME</NavbarItem>
        <NavbarItem onClick={() => navigate("/plan/add")}>내 여행</NavbarItem>
        <NavbarItem onClick={() => navigate("/tour/list")}>투어</NavbarItem>
        <NavbarItem onClick={() => navigate("/")}>좋아요</NavbarItem>
        <NavbarItem onClick={() => navigate("/")}>장바구니</NavbarItem>
        <NavbarItem onClick={() => navigate("/")}>알림</NavbarItem>
        <NavbarItem onClick={() => navigate("/")}>팔로우</NavbarItem>
        <NavbarItem onClick={() => navigate("/member/signup")}>
          회원가입
        </NavbarItem>
        <NavbarItem onClick={() => navigate("/member/login")}>
          로그인
        </NavbarItem>
        <NavbarItem
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/member/login");
          }}
        >
          로그아웃
        </NavbarItem>
      </Flex>
    </nav>
  );
}

export default Navbar;
