import React, { useContext, useState } from "react";
import "./common.css";
import "./Navbar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";

function Navbar(props) {
  const [dropdownOpen, setDropdownOpen] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const { email, isAdmin, isPartner, isAuthenticated, logout } = useContext(
    AuthenticationContext,
  );

  const isActive = (path) => location.pathname === path;

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className={"navbar"}>
      <h1 className={"logo"} onClick={() => navigate("/")}>
        My Travel
      </h1>

      <div className={"nav-container"}>
        <ul>
          <li
            className={isActive("/plan/list") ? "active" : ""}
            onClick={() => navigate("/plan/list")}
          >
            내 여행
          </li>
          <li
            className={isActive("/wallet/list") ? "active" : ""}
            onClick={() => navigate("/wallet/list")}
          >
            내 지갑
          </li>
          <li
            className={isActive("/tour/list") ? "active" : ""}
            onClick={() => navigate("/tour/list")}
          >
            투어
          </li>
          <li
            className={isActive("/community/list") ? "active" : ""}
            onClick={() => navigate("/community/list")}
          >
            커뮤니티
          </li>
        </ul>
      </div>

      <div className={"user-container"}>
        <div className={"dropdown"}>
          <button className={"dropdown-toggle-button"} onClick={toggleDropdown}>
            My Page
          </button>
        </div>

        {dropdownOpen && (
          <div className={"dropdown-toggle-container"}>
            <ul>
              {/* 로그인 안 했을 때 보임 */}
              {isAuthenticated || (
                <li onClick={() => navigate("/member/login")}>로그인</li>
              )}

              {isAuthenticated || (
                <li onClick={() => navigate("/member/signup")}>회원가입</li>
              )}

              {/* 로그인 해야 보임 */}
              {isAuthenticated && (
                <li onClick={() => navigate(`/mypage/${email}`)}>회원정보</li>
              )}

              {isAuthenticated && (
                <li
                  onClick={() => {
                    logout();
                    navigate("/member/login");
                  }}
                >
                  로그아웃
                </li>
              )}

              <li onClick={() => navigate("/cart")}>장바구니</li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
