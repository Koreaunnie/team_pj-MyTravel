import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";
import { MdOutlinePayment } from "react-icons/md";
import { formattedDateTime } from "../../components/utils/FormattedDateTime.jsx";
import "./payment.css";
import { formatNumberWithCommas } from "../../components/utils/FormatNumberWithCommas.jsx";

function PaymentHistory(props) {
  const [paidList, setPaidList] = useState([]);
  const [reviewCheck, setReviewCheck] = useState(true);
  const { email } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/payment/list/${email}`).then((res) => {
      setPaidList(res.data);
    });
  }, []);

  console.log(paidList);

  function handleRowClick(tourId) {
    navigate(`/tour/view/${tourId}`);
  }

  function handleWriteReviewClick(tourId) {
    navigate(`/tour/view/${tourId}#review`);
  }

  // 내 지갑에 추가
  const handleAddToWallet = (tour) => {
    axios
      .post("/api/wallet/add", {
        date: tour.paidAt,
        category: "여행",
        title: tour.product,
        income: 0,
        expense: tour.price,
        memo: tour.location,
        paymentDetailId: tour.paymentDetailId,
      })
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        axios.get(`/api/payment/list/${email}`).then((res) => {
          setPaidList(res.data);
        });
      });
  };

  // 내 여행에 추가
  const handleAddToPlan = (tour) => {
    axios
      .post("/api/plan/add", {
        title: tour.product,
        description: "마이트래블에서 결제한 여행 상품",
        destination: tour.location,
        startDate: tour.startDate,
        endDate: tour.endDate,
        paymentDetailId: tour.paymentDetailId,
        planFieldList: [
          {
            memo: `결제번호: ${tour.paymentId}`,
          },
        ],
      })
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        axios.get(`/api/payment/list/${email}`).then((res) => {
          setPaidList(res.data);
        });
      });
  };

  return (
    <div className={"payment-history"}>
      <h1>내 결제 내역</h1>
      <h2>결제하신 상품을 확인할 수 있습니다.</h2>

      <div className={"body-normal"}>
        {paidList.length === 0 ? (
          <div className={"empty-container"}>
            <p>
              <MdOutlinePayment
                className={"empty-container-icon"}
                style={{ color: "#a1a1a8" }}
              />
            </p>
            <p className={"empty-container-title"}>결제한 상품이 없습니다.</p>
            <p className={"empty-container-description"}>
              장바구니를 확인해주세요.
            </p>
          </div>
        ) : (
          <div className={"payment-list"}>
            <div>
              {paidList.map((tour) => (
                <ul key={tour.id}>
                  <div className={"payment-list-header"}>
                    <li>{formattedDateTime(tour.paidAt)}</li>
                    <li>{tour.paymentId}</li>
                  </div>

                  <div className={"payment-list-body"}>
                    <li>{tour.location}</li>
                    <li>{tour.product}</li>
                    <li>
                      {tour.startDate} ~ {tour.endDate}
                    </li>
                    <div className={"flex"}>
                      <li>
                        {formatNumberWithCommas(tour.price)}
                        {tour.currency === "CURRENCY_KRW"
                          ? "원"
                          : tour.currency}
                      </li>
                      <li onClick={() => handleRowClick(tour.tourId)}>
                        결제한 상품 보기 &#8594;
                      </li>
                    </div>
                  </div>

                  {/*후기 버튼: 이 tour.id의 후기 작성 경험이 있으면 '확인', 없으면 '작성'*/}
                  <div className={"payment-list-footer btn-wrap"}>
                    <li>
                      {tour.review ? (
                        <button
                          className={"btn btn-dark-outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWriteReviewClick(tour.tourId);
                          }}
                        >
                          후기 확인
                        </button>
                      ) : (
                        <button
                          className={"btn btn-dark"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWriteReviewClick(tour.tourId);
                          }}
                        >
                          후기 작성
                        </button>
                      )}
                    </li>

                    <div className={"display-flex"}>
                      <li>
                        {tour.walletId ? (
                          <button
                            className={"btn btn-dark-outline"}
                            onClick={(e) => {
                              e.stopPropagation();

                              navigate(`/wallet/list`);
                            }}
                          >
                            내 지갑 확인
                          </button>
                        ) : (
                          <button
                            className={"btn btn-dark-outline"}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToWallet(tour);
                            }}
                          >
                            내 지갑에 추가
                          </button>
                        )}
                      </li>

                      <li>
                        {tour.planId ? (
                          <button
                            className={"btn btn-dark-outline"}
                            onClick={(e) => {
                              e.stopPropagation();

                              navigate(`/plan/list`);
                            }}
                          >
                            내 여행 확인
                          </button>
                        ) : (
                          <button
                            className={"btn btn-dark-outline"}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToPlan(tour);
                            }}
                          >
                            내 여행에 추가
                          </button>
                        )}
                      </li>
                    </div>
                  </div>
                </ul>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentHistory;
