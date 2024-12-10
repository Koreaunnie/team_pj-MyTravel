import React, { useContext, useEffect, useRef, useState } from "react";
import "./common.css";
import "./Navbar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";

function Navbar(props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // 드롭다운 영역 참조
  const navigate = useNavigate();
  const location = useLocation();
  const { email, nickname, isAdmin, isPartner, isAuthenticated, logout } =
    useContext(AuthenticationContext);

  const isActive = (path) => location.pathname.startsWith(path);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // 드롭다운 내부 클릭이 아닐 경우 닫기
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={"navbar"}>
      <h1 className={"logo"} onClick={() => navigate("/")}>
        My Travel
      </h1>

      <div className={"nav-container"}>
        <ul>
          <li
            className={isActive("/tour") ? "active" : ""}
            onClick={() => navigate("/tour/list")}
          >
            투어
          </li>
          <li
            className={isActive("/community") ? "active" : ""}
            onClick={() => navigate("/community/list")}
          >
            커뮤니티
          </li>
          {isAuthenticated && (
            <li
              className={isActive("/plan") ? "active" : ""}
              onClick={() => navigate("/plan/list")}
            >
              내 여행
            </li>
          )}
          <li
            className={isActive("/wallet") ? "active" : ""}
            onClick={() => navigate("/wallet/list")}
          >
            내 지갑
          </li>
          <li
            className={isActive("/cs") ? "active" : ""}
            onClick={() => navigate("/cs/index")}
          >
            고객센터
          </li>
          {isAdmin && (
            <li
              className={isActive("/admin") ? "active" : ""}
              onClick={() => navigate("/admin")}
            >
              관리자
            </li>
          )}
        </ul>
      </div>

      <div className={"user-container"}>
        {isAuthenticated && (
          <div ref={dropdownRef}>
            <p className={"user-info"}>
              <span className={"user"}>{nickname}</span>
              님, 환영합니다.
            </p>
            <button className={"user-button"} onClick={toggleDropdown}>
              My Page
            </button>
            {dropdownOpen && (
              <div className={"mypage-toggle-container"}>
                <ul>
                  <li onClick={() => navigate(`/mypage/${email}`)}>회원정보</li>
                  <li onClick={() => navigate("/cart")}>장바구니</li>
                  <li
                    onClick={() => {
                      logout();
                      navigate("/member/login");
                    }}
                  >
                    로그아웃
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}

        {isAuthenticated || (
          <div>
            <button
              className={"user-button"}
              onClick={() => navigate("/member/login")}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
