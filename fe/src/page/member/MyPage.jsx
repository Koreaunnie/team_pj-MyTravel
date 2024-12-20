import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
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
                  ? `자사 상품`
                  : "내가 쓴 글"
        }
        navigateToDepth2={() => {}}
      />

      <div className={"body-wide member-mypage"}>
        <h1>마이페이지</h1>

        <nav className={"mypage-nav"}>
          <ul>
            <li
              className={selectedMenu === "profile" ? "active" : ""}
              onClick={() => {
                handleMenuClick("profile");
              }}
            >
              내 프로필
            </li>
            <li
              className={selectedMenu === "cart" ? "active" : ""}
              onClick={() => handleMenuClick("cart")}
            >
              장바구니
            </li>
            <li
              className={selectedMenu === "paymentHistory" ? "active" : ""}
              onClick={() => handleMenuClick("paymentHistory")}
            >
              결제 내역
            </li>
            {(isPartner || isAdmin) && (
              <li
                className={selectedMenu === "myTour" ? "active" : ""}
                onClick={() => handleMenuClick("myTour")}
              >
                자사 상품
              </li>
            )}
            <li
              className={selectedMenu === "myCommunity" ? "active" : ""}
              onClick={() => handleMenuClick("myCommunity")}
            >
              내가 쓴 글
            </li>
          </ul>
        </nav>

        <section className={"mypage-body"}>
          {selectedMenu === "profile" && <MemberInfo />}
          {selectedMenu === "cart" && <CartList />}
          {selectedMenu === "paymentHistory" && <PaymentHistory />}
          {selectedMenu === "myTour" && <TourMyList />}
          {selectedMenu === "myCommunity" && <CommunityMyList />}
        </section>
      </div>
    </div>
  );
}

export default MyPage;
