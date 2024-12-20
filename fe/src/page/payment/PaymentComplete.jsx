import React, { useContext, useState } from "react";
import { Image } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";

function PaymentComplete(props) {
  const location = useLocation();
  const { paidList, paymentId, totalAmount, date } = location.state || {};
  const navigate = useNavigate();
  const { email } = useContext(AuthenticationContext);

  if (!paidList || !paymentId || !totalAmount) {
    return <p>결제 정보가 전달되지 않았습니다.</p>;
  }

  // 상태: 각 상품의 "내 지갑에 추가" 버튼 상태 저장
  const [walletButtons, setWalletButtons] = useState(
    paidList.reduce((acc, product) => {
      acc[product.product] = false; // 초기값: 모든 버튼이 활성화
      return acc;
    }, {}),
  );

  // 상태: 각 상품의 "내 지갑에 추가" 버튼 상태 저장
  const [planButtons, setPlanButtons] = useState(
    paidList.reduce((acc, product) => {
      acc[product.product] = false; // 초기값: 모든 버튼이 활성화
      return acc;
    }, {}),
  );

  //지갑에 추가
  const handleSendToWallet = (product) => {
    axios
      .post("/api/wallet/add", {
        date,
        category: "여행",
        title: product.product,
        income: 0,
        expense: product.price,
        memo: product.location,
      })
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        // 클릭된 버튼을 "내 지갑 확인" 상태로 변경
        setWalletButtons((prevState) => ({
          ...prevState,
          [product.product]: true,
        }));
      });
  };

  const handleNavigateToWallet = () => {
    navigate("/wallet/list");
  };

  const handleNavigateToPlan = () => {
    navigate("/plan/list");
  };

  // 내 여행에 추가
  const handleSendToPlan = (product) => {
    axios
      .post("/api/plan/add", {
        title: product.product,
        description: "마이트래블에서 결제한 여행 상품",
        destination: product.location,
        startDate: product.startDate,
        endDate: product.endDate,
        planFieldList: [
          {
            memo: `결제번호: ${paymentId}`,
          },
        ],
      })
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        // 클릭된 버튼을 "내 여행 확인" 상태로 변경
        setPlanButtons((prevState) => ({
          ...prevState,
          [product.product]: true,
        }));
      });
  };

  return (
    <div className={"tour"}>
      <Breadcrumb
        depth1={"투어"}
        navigateToDepth1={() => navigate(`/tour/list`)}
        depth2={"장바구니"}
        navigateToDepth2={() => navigate(`/cart`)}
        depth3={"결제"}
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
              <th>선택</th>
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
                <td>
                  {walletButtons[product.product] ? (
                    <button
                      className={"btn btn-dark-outline"}
                      onClick={handleNavigateToWallet}
                      disabled={false} // "내 지갑 확인" 버튼은 항상 활성화
                    >
                      내 지갑 확인
                    </button>
                  ) : (
                    <button
                      className={"btn btn-dark"}
                      onClick={() => handleSendToWallet(product)}
                    >
                      내 지갑에 추가
                    </button>
                  )}
                  {planButtons[product.product] ? (
                    <button
                      className={"btn btn-dark-outline"}
                      onClick={handleNavigateToPlan}
                      disabled={false} // "내 지갑 확인" 버튼은 항상 활성화
                    >
                      내 여행 확인
                    </button>
                  ) : (
                    <button
                      className={"btn btn-dark"}
                      onClick={(e) => {
                        handleSendToPlan(product);
                      }}
                    >
                      내 여행에 추가
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          ))}
          {/*총 합*/}
          <tfoot>
            <tr>
              <td colSpan={2}></td>
              <th>결제 금액</th>
              <td>{totalAmount}</td>
              <td>
                <button
                  className={"btn btn-dark-outline"}
                  onClick={() => navigate(`/payment/history/${email}`)}
                >
                  내 결제 내역으로 이동
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </main>
    </div>
  );
}

export default PaymentComplete;
