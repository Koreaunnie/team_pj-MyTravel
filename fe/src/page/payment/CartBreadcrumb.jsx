import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import React from "react";

export function CartBreadcrumb() {
  return (
    <Breadcrumb
      depth1={"Tour 목록"}
      navigateToDepth1={() => navigate(`/tour/list`)}
      depth2={"장바구니"}
      navigateToDepth2={() => navigate(`/cart`)}
    />
  );
}
