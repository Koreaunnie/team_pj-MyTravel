import React from "react";
import { PaymentHistoryBreadcrumb } from "./PaymentHistoryBreadcrumb.jsx";
import PaymentHistory from "./PaymentHistory.jsx";

function PaymentHistoryCombined(props) {
  return (
    <div className={"tour"}>
      <PaymentHistoryBreadcrumb />
      <PaymentHistory />
    </div>
  );
}

export default PaymentHistoryCombined;
