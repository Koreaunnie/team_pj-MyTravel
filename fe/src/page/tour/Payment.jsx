import React, { useEffect, useState } from "react";

import PortOne from "@portone/browser-sdk";
import { useLocation } from "react-router-dom";
import { Image } from "@chakra-ui/react";

function Payment(props) {
  const location = useLocation();
  const [tour, setTour] = useState(null);
  const [waitingPayment, setWaitingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState({
    status: "IDLE",
  });

  useEffect(() => {
    if (location.state && location.state.tour) {
      setTour(location.state.tour);
    }
  }, [location.state]);

  if (tour == null) {
    return (
      <dialog open>
        <article aria-busy>결제 정보를 불러오는 중입니다.</article>
      </dialog>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWaitingPayment(true);

    const paymentId = "세팅해줘야함";
    const payment = await PortOne.requestPayment({
      storeId: "store-e9111bf4-6996-4a6c-ac48-58b9ee8f9c43",
      channelKey: "channel-key-b42ef11e-6046-4851-8610-45af77d2ff86",
      paymentId,
      orderName: "주문내용",
      totalAmount: 10000,
      currency: "CURRENCY_KRW",
      payMethod: "EASY_PAY",
    });
    if (payment.code != null) {
      //실패 내용
      setWaitingPayment(false);
      setPaymentStatus({
        status: "FAILED",
        message: payment.message,
      });
      return;
    }
    // payment/complete 엔드포인트 구현
    const completeResponse = await fetch(`/api/payment/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //paymentId와 주문정보를 서버에 전달
      body: JSON.stringify({
        paymentId: payment.paymentId,
        //주문정보
      }),
    });
    setWaitingPayment(false);
    if (completeResponse.ok) {
      const paymentComplete = await completeResponse.json();
      setPaymentStatus({
        status: paymentComplete.status,
      });
    } else {
      setPaymentStatus({
        status: "FAILED",
        message: await completeResponse.text(),
      });
    }
  };

  const totalPrice = () => {
    return tour.reduce((sum, tour) => sum + tour.price, 0);
  };

  return (
    <div>
      <main>
        <form onSubmit={handleSubmit}>
          <table className={"table-list"}>
            <thead>
              <tr>
                <th colSpan={2}>상품</th>
                <th>일정</th>
                <th>가격</th>
              </tr>
            </thead>
            {/*결제할 상품 나열*/}
            {tour.map((product) => (
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
              <th colSpan={3}>결제 금액</th>
              <td>{totalPrice()}</td>
            </tfoot>
          </table>

          <button className={"btn btn-dark-outline"} type={"submit"}>
            n원 결제
          </button>
        </form>
      </main>

      {/*<h1>결제</h1>*/}
      {/*<div>예약 내역: list</div>*/}
      {/*<div>결제 내용: price list + sum</div>*/}
      {/*<div>예약자: personal info 불러오기 (수정 가능)</div>*/}
      {/*<div>여행자 정보: input text</div>*/}
      {/*<div>추가 예약 정보: textarea</div>*/}
      {/*<div>결제 방법: card, 무통장 입금</div>*/}
      {/*<div>약관 안내: text</div>*/}
    </div>
  );
}

export default Payment;
