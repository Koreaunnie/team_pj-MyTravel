import React from "react";

function Payment(props) {
  return (
    <div>
      <h1>결제</h1>
      <div>예약 내역: list</div>
      <div>결제 내용: price list + sum</div>
      <div>예약자: personal info 불러오기 (수정 가능)</div>
      <div>여행자 정보: input text</div>
      <div>추가 예약 정보: textarea</div>
      <div>결제 방법: card, 무통장 입금</div>
      <div>약관 안내: text</div>
      <div>
        <button className={"btn btn-dark-outline"}>n원 결제</button>
      </div>
    </div>
  );
}

export default Payment;
