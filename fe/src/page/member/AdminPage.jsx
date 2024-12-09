import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { Box, VStack } from "@chakra-ui/react";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import "./Member.css";
import PaymentHistoryAll from "../tour/PaymentHistoryAll.jsx";
import MemberList from "./MemberList.jsx";
import PartnerList from "./PartnerList.jsx";

function MyPage(props) {
  const [selectedMenu, setSelectedMenu] = useState("profile");
  const { isAdmin } = useContext(AuthenticationContext);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div className={"member"}>
      <Breadcrumb
        depth1={"관리자 창"}
        navigateToDepth1={() => navigate(`/admin`)}
      />
      <h1>관리자 창</h1>
      <Box>
        <VStack align={"start"} spacing={"10px"}>
          <button onClick={() => handleMenuClick("memberList")}>
            사용자 목록
          </button>
          <button onClick={() => handleMenuClick("partnerList")}>
            파트너 기업 목록
          </button>
          <button onClick={() => handleMenuClick("paymentAll")}>
            사이트 내 총 결제 내역
          </button>
        </VStack>
      </Box>
      <Box flex="1" padding="20px">
        {selectedMenu === "memberList" && <MemberList />}
        {selectedMenu === "partnerList" && <PartnerList />}
        {selectedMenu === "paymentAll" && <PaymentHistoryAll />}
      </Box>
    </div>
  );
}

export default MyPage;
