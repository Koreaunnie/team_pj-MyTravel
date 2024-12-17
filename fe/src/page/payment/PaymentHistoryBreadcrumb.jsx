import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import React from "react";

export function PaymentHistoryBreadcrumb() {
  return (
    <Breadcrumb
      depth1={"Tour 목록"}
      navigateToDepth1={() => navigate(`/tour/list`)}
      depth2={"결제 내역"}
      navigateToDepth2={() => navigate(`/payment/history/${email}`)}
    />
  );
}
