import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import PaymentHistoryAll from "../payment/PaymentHistoryAll.jsx";
import "./admin.css";
import AdminCs from "./AdminCs.jsx";
import Access from "../../components/context/Access.jsx";
import PartnerList from "./PartnerList.jsx";
import MemberList from "./MemberList.jsx";

function MyPage(props) {
  const [selectedMenu, setSelectedMenu] = useState("home");
  const { isAdmin, nickname } = useContext(AuthenticationContext);

  if (!isAdmin) {
    return <Access />;
  }

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    window.scrollTo(0, 0); // 페이지 상단으로 스크롤
  };

  return (
    <div className={"member"}>
      <Breadcrumb
        depth1={"관리자 모드"}
        navigateToDepth1={() => navigate(`/admin`)}
        depth2={
          selectedMenu === "home"
            ? "관리자 홈"
            : selectedMenu === "memberList"
              ? "회원 관리"
              : selectedMenu === "partnerList"
                ? "파트너 기업 관리"
                : selectedMenu === "paymentAll"
                  ? `결제 내역 관리`
                  : "고객 센터 관리"
        }
        navigateToDepth2={() => {}}
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
            회원 관리
          </li>
          <li
            className={selectedMenu === "partnerList" ? "active" : ""}
            onClick={() => handleMenuClick("partnerList")}
          >
            파트너 기업 관리
          </li>
          <li
            className={selectedMenu === "paymentAll" ? "active" : ""}
            onClick={() => handleMenuClick("paymentAll")}
          >
            결제 내역 관리
          </li>
          <li
            className={selectedMenu === "csList" ? "active" : ""}
            onClick={() => handleMenuClick("csList")}
          >
            고객 센터 관리
          </li>
        </ul>
      </nav>

      <section className={"admin-body"}>
        {selectedMenu === "home" && (
          <div className={"admin-index"}>
            <h1>관리자 화면은 PC에 최적화되어있습니다.</h1>
            <h2>로그인 한 관리자: {nickname}</h2>
          </div>
        )}
        {selectedMenu === "memberList" && <MemberList />}
        {selectedMenu === "partnerList" && <PartnerList />}
        {selectedMenu === "paymentAll" && <PaymentHistoryAll />}
        {selectedMenu === "csList" && <AdminCs />}
      </section>
    </div>
  );
}

export default MyPage;
