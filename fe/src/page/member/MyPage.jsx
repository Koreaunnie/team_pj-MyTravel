import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { Box, VStack } from "@chakra-ui/react";
import MemberInfo from "./MemberInfo.jsx";
import CartList from "../tour/CartList.jsx";
import TourMyList from "../tour/TourMyList.jsx";
import PaymentHistory from "../tour/PaymentHistory.jsx";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import "./Member.css";

function MyPage(props) {
  const [selectedMenu, setSelectedMenu] = useState("profile");
  const { email, isPartner, isAdmin } = useContext(AuthenticationContext);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div className={"member"}>
      <Breadcrumb
        depth1={"마이페이지"}
        navigateToDepth1={() => navigate(`/mypage/${id}`)}
      />
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
          <button onClick={() => handleMenuClick("paymentHistory")}>
            결제 내역
          </button>
          {(isPartner || isAdmin) && (
            <button onClick={() => handleMenuClick("myTour")}>
              {email}의 상품
            </button>
          )}
        </VStack>
      </Box>
      <Box flex="1" padding="20px">
        {selectedMenu === "profile" && <MemberInfo />}
        {selectedMenu === "cart" && <CartList />}
        {selectedMenu === "paymentHistory" && <PaymentHistory />}
        {selectedMenu === "myTour" && <TourMyList />}
      </Box>
    </div>
  );
}

export default MyPage;
