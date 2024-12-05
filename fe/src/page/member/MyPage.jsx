import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { Box, VStack } from "@chakra-ui/react";
import MemberInfo from "./MemberInfo.jsx";
import CartList from "../tour/CartList.jsx";

function MyPage(props) {
  const [selectedMenu, setSelectedMenu] = useState("profile");
  const { email } = useContext(AuthenticationContext);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div>
      <h1>마이페이지</h1>
      <Box>
        <VStack align={"start"} spacing={"10px"}>
          <button
            onClick={() => {
              handleMenuClick("profile");
            }}
          >
            내 프로필
          </button>
          <button onClick={() => handleMenuClick("cart")}>내 장바구니</button>
          <button onClick={() => handleMenuClick("")}>결제 내역</button>
          <button onClick={() => handleMenuClick("")}>내가 쓴 글</button>
        </VStack>
      </Box>
      <Box flex="1" padding="20px">
        {selectedMenu === "profile" && <MemberInfo />}
        {selectedMenu === "cart" && <CartList />}
        <p>결제 내역 Payment History</p>
        <p>내 가 쓴 글 게시판</p>
      </Box>
    </div>
  );
}

export default MyPage;
