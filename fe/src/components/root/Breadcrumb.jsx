import { MdHomeFilled } from "react-icons/md";
import React from "react";
import { useNavigate } from "react-router-dom";

export function Breadcrumb({
  depth1,
  navigateToDepth1,
  depth2,
  navigateToDepth2,
}) {
  const navigate = useNavigate();

  return (
    <nav className={"breadcrumb-wrap"} aria-label="브레드크럼">
      <ol className={"breadcrumb"}>
        <p>
          <MdHomeFilled className={"icon"} />
        </p>
        <li onClick={() => navigate(`/`)}>Home</li>
        <p>&gt;</p>
        <li
          className={navigateToDepth1 && !navigateToDepth2 ? "on" : ""}
          onClick={navigateToDepth1}
        >
          {depth1}
        </li>
        {navigateToDepth2 && <p>&gt;</p>}
        {navigateToDepth2 && (
          <li
            className={navigateToDepth2 ? "on" : ""}
            onClick={navigateToDepth2}
          >
            {depth2}
          </li>
        )}
      </ol>
    </nav>
  );
}
