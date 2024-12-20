import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import React from "react";
import { useNavigate } from "react-router-dom";

export function CartBreadcrumb() {
  const navigate = useNavigate();

  return (
    <Breadcrumb
      depth1={"투어"}
      navigateToDepth1={() => navigate(`/tour/list`)}
      depth2={"장바구니"}
      navigateToDepth2={() => navigate(`/cart`)}
    />
  );
}
