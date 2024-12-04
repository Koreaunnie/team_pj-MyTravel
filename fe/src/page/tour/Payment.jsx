import React, { useEffect, useState } from "react";
import PortOne from "@portone/browser-sdk";

function Payment(props) {
  const [tour, setTour] = useState(null);
  const [waitingPayment, setWaitingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState({
    status: "IDLE",
  });

  useEffect(() => {
    async function loadTour() {
      const response = await fetch("/api/tour");
      setTour(await response.json());
    }

    loadTour().catch((error) => console.error(error));
  }, []);

  if (tour == null) {
    return (
      <dialog open>
        <article aria-busy>결제할 상품을 선택해 주십시오.</article>
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
      payMethod: "CARD",
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

  return (
    <div>
      <main>
        <form onSubmit={handleSubmit}>
          <article>
            {/*결제할 상품 나열*/}
            <div>
              <div>
                <p>이미지</p>
                <image src={``} />
              </div>
              <div>
                <p>상품명</p>
                <p>상품 가격</p>
              </div>
            </div>
            {/*총 합*/}
            <div>
              <label>총 구입 가격</label>
              ~원
            </div>
          </article>
          <button className={"btn btn-dark-outline"} type={"submit"}>
            n원 결제
          </button>
        </form>
      </main>
      {/* 성공/실패 모달 작성*/}

      <h1>결제</h1>
      <div>예약 내역: list</div>
      <div>결제 내용: price list + sum</div>
      <div>예약자: personal info 불러오기 (수정 가능)</div>
      <div>여행자 정보: input text</div>
      <div>추가 예약 정보: textarea</div>
      <div>결제 방법: card, 무통장 입금</div>
      <div>약관 안내: text</div>
    </div>
  );
}

export default Payment;
