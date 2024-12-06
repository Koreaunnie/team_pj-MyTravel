import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function PaymentHistory(props) {
  const [paidList, setPaidList] = useState([]);
  const { email } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/payment/list/${email}`).then((res) => {
      setPaidList(res.data);
    });
  }, []);

  return (
    <div>
      <h1>내 결제 내역</h1>
      {paidList.length === 0 ? (
        <p>결제한 상품이 없습니다.</p>
      ) : (
        <table className={"table-list"}>
          <thead>
            <tr>
              <th>결제일</th>
              <th>결제 번호</th>
              <th>상품</th>
              <th>위치</th>
              <th>가격</th>
              <th>통화</th>
              <th>여행 날짜</th>
            </tr>
          </thead>
          <tbody>
            {paidList.map((tour, index) => (
              <React.Fragment key={index}>
                <tr key={tour.id}>
                  <td>{tour.paidAt}</td>
                  <td>{tour.paymentId}</td>
                  <td>{tour.product}</td>
                  <td>{tour.location}</td>
                  <td>{tour.price}</td>
                  <td>{tour.currency}</td>
                  <td>
                    {tour.startDate}
                    <br />~{tour.endDate}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PaymentHistory;
