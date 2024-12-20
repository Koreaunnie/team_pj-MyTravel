import React, { useContext, useEffect, useRef, useState } from "react";
import "./common.css";
import "./Navbar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, nickname, isAdmin, isAuthenticated, logout } = useContext(
    AuthenticationContext,
  );

  const isActive = (path) => location.pathname.startsWith(path);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const toggleHamburgerMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
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
    <nav className="navbar">
      <h1 className="logo" onClick={() => navigate("/")}>
        My Travel
      </h1>

      <div className={`nav-container ${menuOpen ? "show" : ""}`}>
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
            <>
              <li
                className={isActive("/plan") ? "active" : ""}
                onClick={() => navigate("/plan/list")}
              >
                내 여행
              </li>
              <li
                className={isActive("/wallet") ? "active" : ""}
                onClick={() => navigate("/wallet/list")}
              >
                내 지갑
              </li>
            </>
          )}
          <li
            className={isActive("/notice") ? "active" : ""}
            onClick={() => navigate("/notice/list")}
          >
            공지사항
          </li>
          <li
            className={isActive("/cs") ? "active" : ""}
            onClick={() => navigate("/cs/index")}
          >
            고객센터
          </li>
          {isAdmin && (
            <li
              className={`admin ${isActive("/admin") ? "active" : ""}`}
              onClick={() => navigate("/admin")}
            >
              관리자
            </li>
          )}
        </ul>
      </div>

      <button className="hamburger" onClick={toggleHamburgerMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
    </nav>
  );
}

export default Navbar;
