import React, { useEffect, useState } from "react";

import PortOne from "@portone/browser-sdk";
import { useLocation } from "react-router-dom";
import { Image } from "@chakra-ui/react";

function randomId() {
  return Array.from(crypto.getRandomValues(new Uint32Array(2)))
    .map((word) => word.toString(16).padStart(8, "0"))
    .join("");
}

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

    const paymentId = randomId();
    const payment = await PortOne.requestPayment({
      storeId: "store-e9111bf4-6996-4a6c-ac48-58b9ee8f9c43",
      channelKey: "channel-key-b42ef11e-6046-4851-8610-45af77d2ff86",
      paymentId,
      orderName: tour[0].product + " 그 외",
      totalAmount: totalPrice(),
      currency: "CURRENCY_KRW",
      payMethod: "EASY_PAY",
      redirect_url: `http://localhost:5173/payment/complete`,
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
    const completeResponse = await fetch(
      `http://localhost:5173/payment/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        //paymentId와 주문정보를 서버에 전달
        body: JSON.stringify({
          ...tour,
          paymentId,
          //주문정보
        }),
      },
    );

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

  const handleClose = () => {
    setPaymentStatus({ status: "IDLE" });
  };

  return (
    <div>
      <h1>결제</h1>
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
              <tr>
                <td colSpan={2}></td>
                <th>결제 금액</th>
                <td>{totalPrice()}</td>
              </tr>
            </tfoot>
          </table>

          <button className={"btn btn-dark-outline"} type={"submit"}>
            결제
          </button>
        </form>
      </main>
      {paymentStatus.status === "FAILED" && (
        <dialog open>
          <header>
            <h1>결제 실패</h1>
          </header>
          <p>{paymentStatus.message}</p>
          <button
            type={"button"}
            className={"btn btn-dark-outline"}
            onClick={handleClose}
          >
            닫기
          </button>
        </dialog>
      )}
      <dialog>
        <header>
          <h1>결제 성공</h1>
        </header>
        <p>결제에 성공했씁니다.</p>
        <buttn
          type={"button"}
          className={"btn btn-dark-outline"}
          onClick={handleClose}
        >
          닫기
        </buttn>
      </dialog>
      <dialog open={paymentStatus.status === "VIRTUAL_ACCOUNT_ISSUED"}>
        <header>
          <h1>가장 계좌 발급 완료</h1>
        </header>
        <p>가상 계좌가 발급되었습니다.</p>

        <buttn
          type={"button"}
          className={"btn btn-dark-outline"}
          onClick={handleClose}
        >
          닫기
        </buttn>
      </dialog>

      {/*<div>예약자: personal info 불러오기 (수정 가능)</div>*/}
      {/*<div>여행자 정보: input text</div>*/}
      {/*<div>추가 예약 정보: textarea</div>*/}
      {/*<div>결제 방법: card, 무통장 입금</div>*/}
      {/*<div>약관 안내: text</div>*/}
    </div>
  );
}

export default Payment;
