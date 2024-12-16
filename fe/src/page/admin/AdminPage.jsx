import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { Box } from "@chakra-ui/react";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import PaymentHistoryAll from "../tour/PaymentHistoryAll.jsx";
import MemberList from "../member/MemberList.jsx";
import PartnerList from "../member/PartnerList.jsx";
import CsIndex from "../cs/CsIndex.jsx";
import "./admin.css";

function MyPage(props) {
  const [selectedMenu, setSelectedMenu] = useState("profile");
  const { isAdmin, nickname } = useContext(AuthenticationContext);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div className={"member"}>
      <Breadcrumb
        depth1={"관리자 창"}
        navigateToDepth1={() => navigate(`/admin`)}
      />

      <nav className={"admin-aside"}>
        <h1>
          관리자 모드 <span className={"nickname"}>{nickname} 님</span>
        </h1>

        <ul>
          <li
            className={selectedMenu === "home" ? "active" : ""}
            onClick={() => handleMenuClick("home")}
          >
            홈
          </li>

          <li
            className={selectedMenu === "memberList" ? "active" : ""}
            onClick={() => handleMenuClick("memberList")}
          >
            사용자 목록
          </li>
          <li
            className={selectedMenu === "partnerList" ? "active" : ""}
            onClick={() => handleMenuClick("partnerList")}
          >
            파트너 기업 목록
          </li>
          <li
            className={selectedMenu === "paymentAll" ? "active" : ""}
            onClick={() => handleMenuClick("paymentAll")}
          >
            사이트 내 총 결제 내역
          </li>
          <li
            className={selectedMenu === "csList" ? "active" : ""}
            onClick={() => handleMenuClick("csList")}
          >
            고객센터
          </li>
        </ul>
      </nav>

      <Box flex="1" padding="20px">
        {selectedMenu === "home" && "/"}
        {selectedMenu === "memberList" && <MemberList />}
        {selectedMenu === "partnerList" && <PartnerList />}
        {selectedMenu === "paymentAll" && <PaymentHistoryAll />}
        {selectedMenu === "csList" && <CsIndex />}
      </Box>
    </div>
  );
}

export default MyPage;
