import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import React from "react";
import { useNavigate } from "react-router-dom";

export function PaymentHistoryBreadcrumb() {
  const navigate = useNavigate();

  return (
    <Breadcrumb
      depth1={"투어"}
      navigateToDepth1={() => navigate(`/tour/list`)}
      depth2={"결제 내역"}
      navigateToDepth2={() => navigate(`/payment/history/${email}`)}
    />
  );
}
