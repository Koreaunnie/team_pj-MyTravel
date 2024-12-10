import React from "react";
import { Image } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";

function PaymentComplete(props) {
  const location = useLocation();
  const { paidList, paymentId, totalAmount } = location.state || {};

  if (!paidList || !paymentId || !totalAmount) {
    return <p>결제 정보가 전달되지 않았습니다.</p>;
  }

  return (
    <div className={"tour"}>
      <Breadcrumb
        depth1={"Tour 목록"}
        navigateToDepth1={() => navigate(`/tour/list`)}
        depth2={"장바구니"}
        navigateToDepth2={() => navigate(`/cart`)}
        depth3={"결제 완료"}
        navigateToDepth3={() => navigate(`/payment/complete`)}
      />
      <h1>결제 완료</h1>
      <main>
        <h2>결제 번호: {paymentId}</h2>
        <table className={"table-list"}>
          <thead>
            <tr>
              <th colSpan={2}>상품</th>
              <th>일정</th>
              <th>가격</th>
            </tr>
          </thead>
          {/*결제한 상품 나열*/}
          {paidList.map((product) => (
            <tbody>
              <tr>
                <td>
                  <Image key={product.image} src={product.src} w={"100px"} />
                </td>
                <td>{product.product}</td>
                <td>
                  {product.startDate} ~ {product.endDate}
                </td>
                <td>{product.price}</td>
              </tr>
            </tbody>
          ))}
          {/*총 합*/}
          <tfoot>
            <tr>
              <td colSpan={2}></td>
              <th>결제 금액</th>
              <td>{totalAmount}</td>
            </tr>
          </tfoot>
        </table>

        <p>TODO: 내 여행에 추가: link</p>
        <p>TODO: 내 지갑에 추가: link</p>
      </main>
    </div>
  );
}

export default PaymentComplete;
