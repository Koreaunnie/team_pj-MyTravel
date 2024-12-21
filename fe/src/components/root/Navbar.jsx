import React, { useContext, useEffect, useRef, useState } from "react";
import "./common.css";
import "./Navbar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const navContainerRef = useRef(null);
  const hamburgerRef = useRef(null);
  const { email, nickname, isAdmin, isAuthenticated, logout } = useContext(
    AuthenticationContext,
  );

  const isActive = (path) => location.pathname.startsWith(path);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const toggleHamburgerMenu = () => setMenuOpen((prev) => !prev);

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle dropdown menu clicks
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }

      // Handle mobile menu clicks
      // Don't close if clicking the hamburger button itself
      if (hamburgerRef.current && hamburgerRef.current.contains(event.target)) {
        return;
      }

      // Close mobile menu if clicking outside nav container
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <h1 className="logo" onClick={() => navigate("/")}>
        My Travel
      </h1>

      <div className={`nav-container ${menuOpen ? "show" : ""}`}>
        <ul>
          { isAuthenticated && (
          <div className={"mobile-mypage"}>
            <p className={"mobile-user-info"}>{nickname} 님</p>

            <p
              className={"mobile-user-mypage"}
              onClick={() => handleNavigate(`/mypage/${email}`)}
            >
              마이페이지
            </p>
          </div>
          )}

          <li
            onClick={() => handleNavigate("/member/login")}
          >
            로그인
          </li>

          <li
            className={isActive("/tour") ? "active" : ""}
            onClick={() => handleNavigate("/tour/list")}
          >
            투어
          </li>
          <li
            className={isActive("/community") ? "active" : ""}
            onClick={() => handleNavigate("/community/list")}
          >
            커뮤니티
          </li>
          {isAuthenticated && (
            <>
              <li
                className={isActive("/plan") ? "active" : ""}
                onClick={() => handleNavigate("/plan/list")}
              >
                내 여행
              </li>
              <li
                className={isActive("/wallet") ? "active" : ""}
                onClick={() => handleNavigate("/wallet/list")}
              >
                내 지갑
              </li>
            </>
          )}
          <li
            className={isActive("/notice") ? "active" : ""}
            onClick={() => handleNavigate("/notice/list")}
          >
            공지사항
          </li>
          <li
            className={isActive("/cs") ? "active" : ""}
            onClick={() => handleNavigate("/cs/index")}
          >
            고객센터
          </li>
          {isAdmin && (
            <li
              className={`admin ${isActive("/admin") ? "active" : ""}`}
              onClick={() => handleNavigate("/admin")}
            >
              관리자
            </li>
          )}

          {isAuthenticated &&(
          <li
            onClick={() => {
              logout();
              handleNavigate("/member/login");
            }}
          >
            로그아웃
          </li>
          )}
        </ul>
      </div>

      <div className={"pc-user-container"}>
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
                  <li
                    className={isActive("/mypage") ? "active" : ""}
                    onClick={() => handleNavigate(`/mypage/${email}`)}
                  >
                    회원 정보
                  </li>
                  <li
                    className={isActive("/payment/history") ? "active" : ""}
                    onClick={() => handleNavigate(`/payment/history/${email}`)}
                  >
                    결제 내역
                  </li>
                  <li
                    className={isActive("/cart") ? "active" : ""}
                    onClick={() => handleNavigate("/cart")}
                  >
                    {" "}
                    장바구니
                  </li>
                  <li
                    onClick={() => {
                      logout();
                      handleNavigate("/member/login");
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
              onClick={() => handleNavigate("/member/login")}
            >
              Login
            </button>
          </div>
        )}
      </div>

      <button
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={toggleHamburgerMenu}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
    </nav>
  );
}

export default Navbar;
