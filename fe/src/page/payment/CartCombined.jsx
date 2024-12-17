import React from "react";
import { CartBreadcrumb } from "./CartBreadcrumb.jsx";
import CartList from "./CartList.jsx";

export function CartCombined() {
  return (
    <div className={"tour"}>
      <CartBreadcrumb />
      <CartList />
    </div>
  );
}
