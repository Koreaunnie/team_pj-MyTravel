import React from "react";
import "./common.css";
import "./Footer.css";

export function Footer() {
  return (
    <div className={"footer"}>
      <h1 className={"logo"} onClick={() => navigate("/")}>
        My Travel
      </h1>

      <p>이 사이트는 포트폴리오 목적으로 제작되었습니다.</p>
      <p>copyright © 2024 김지민, 민재원, 임현정. All rights reserved.</p>
    </div>
  );
}
