import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { Box, VStack } from "@chakra-ui/react";
import MemberInfo from "./MemberInfo.jsx";
import TourMyList from "../tour/TourMyList.jsx";
import PaymentHistory from "../payment/PaymentHistory.jsx";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import "./Member.css";
import CommunityMyList from "../community/CommunityMyList.jsx";
import CartList from "../payment/CartList.jsx";

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
        depth2={
          selectedMenu === "profile"
            ? "내 프로필"
            : selectedMenu === "cart"
              ? "내 장바구니"
              : selectedMenu === "paymentHistory"
                ? "결제 내역"
                : selectedMenu === "myTour"
                  ? `${email}의 상품`
                  : "내가 쓴 글"
        }
        navigateToDepth2={() => {}}
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
          <button onClick={() => handleMenuClick("myCommunity")}>
            내가 쓴 글
          </button>
        </VStack>
      </Box>
      <Box flex="1" padding="20px">
        {selectedMenu === "profile" && <MemberInfo />}
        {selectedMenu === "cart" && <CartList />}
        {selectedMenu === "paymentHistory" && <PaymentHistory />}
        {selectedMenu === "myTour" && <TourMyList />}
        {selectedMenu === "myCommunity" && <CommunityMyList />}
      </Box>
    </div>
  );
}

export default MyPage;
