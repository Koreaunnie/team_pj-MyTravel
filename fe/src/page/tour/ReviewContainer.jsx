import React, { useEffect, useState } from "react";
import axios from "axios";
import ReviewAdd from "./ReviewAdd.jsx";
import ReviewList from "./ReviewList.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import "./Review.css";
import { formattedDateTime } from "../../components/utils/FormattedDateTime.jsx";

function ReviewContainer({ tourId }) {
  const [reviewList, setReviewList] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [paymentCheck, setPaymentCheck] = useState(false);
  const [paidList, setPaidList] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [activeTab, setActiveTab] = useState("list");

  useEffect(() => {
    if (!processing) {
      axios
        .get(`/api/review/list/${tourId}`)
        .then((res) => res.data)
        .then((data) => setReviewList(data));
    }
  }, [processing]);

  useEffect(() => {
    axios
      .get(`/api/review/payment/${tourId}`)
      .then((res) => setPaidList(res.data));
  }, []);

  function handleSaveReviewClick({ review, rating, reviewImg }) {
    console.log("reviewContainer", reviewImg);

    setProcessing(true);
    axios
      .postForm("/api/review/add", {
        tourId: tourId,
        review: review,
        rating: rating,
        paymentId: selectedPayment,
        reviewImg: reviewImg,
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });

        axios
          .get(`/api/review/payment/${tourId}`)
          .then((res) => setPaidList(res.data));

        setSelectedPayment(null);
      })
      .catch((error) => {
        console.error("오류 코드", error);
        toaster.create({
          type: "error",
          description: "후기를 작성할 수 없습니다.",
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  function handleDeleteReviewClick(reviewId) {
    setProcessing(true);
    axios
      .delete(`/api/review/delete/${reviewId}`)
      .then((res) => {
        // 성공적인 응답을 받아왔을 경우
        const data = res.data;
        if (data.message) {
          toaster.create({
            type: data.message.type,
            description: data.message.text,
          });
        }

        // 후기를 삭제한 후 결제 목록을 다시 받아오기
        return axios.get(`/api/review/payment/${tourId}`);
      })
      .then((res) => {
        // 결제 목록 갱신
        setPaidList(res.data);
      })
      .catch((e) => {
        // 오류 처리
        const data = e.response.data;
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  function handleEditReviewClick(
    reviewId,
    { review, rating, removeFiles, uploadFiles },
  ) {
    setProcessing(true);
    console.log("container-remove", removeFiles);
    console.log("container-upload", uploadFiles);

    axios
      .putForm(`/api/review/edit`, {
        reviewId,
        review,
        rating,
        removeFiles,
        uploadFiles,
        tourId,
      })
      .then((res) => res.data.message)
      .then((message) => {
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  const handleRateChange = (e, setRating) => {
    const value = e.target ? e.target.value : e;
    // console.log("새 별점", value);
    setRating(Number(value));
  };

  const paymentHistoryCheck = () => {
    axios
      .get("/api/review/check", {
        params: { tourId },
      })
      .then((res) => res.data)
      .then((data) => {
        setPaymentCheck(data.available);
      });
    return paymentCheck;
  };

  return (
    <div>
      <ul className={"tab-btn"}>
        <li
          className={activeTab === "list" ? "active" : ""}
          onClick={() => setActiveTab("list")}
        >
          후기
        </li>
        <li
          className={activeTab === "add" ? "active" : ""}
          onClick={() => setActiveTab("add")}
          disabled={!paymentHistoryCheck()} // 결제 내역이 없으면 비활성화
        >
          후기 작성
        </li>
      </ul>

      {/*내역에서 후기 작성할 상품 선택: payment_id 전달*/}
      {activeTab === "add" && (
        <div>
          {paymentHistoryCheck() ? (
            <div className={"review-history"}>
              <h2>후기를 작성할 내역을 선택해주세요.</h2>

              <table className={"table-list"}>
                <thead>
                  <tr>
                    <th>결제일</th>
                    <th>결제번호</th>
                    <th>여행 일정</th>
                  </tr>
                </thead>

                <tbody>
                  {paidList.map((tour) => (
                    <tr
                      key={tour.paymentId}
                      onClick={() => setSelectedPayment(tour.paymentId)}
                      style={{
                        backgroundColor:
                          selectedPayment === tour.paymentId
                            ? "#cdddff"
                            : "transparent",
                      }}
                    >
                      <td>{formattedDateTime(tour.paidAt)}</td>
                      <td>{tour.paymentId}</td>
                      <td>
                        {tour.startDate} ~ {tour.endDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {selectedPayment && (
            <ReviewAdd
              tourId={tourId}
              onSaveClick={handleSaveReviewClick}
              onRateChange={handleRateChange}
            />
          )}
        </div>
      )}

      {/*목록*/}
      {activeTab === "list" &&
        (reviewList.length === 0 ? (
          <p>작성된 후기가 없습니다.</p>
        ) : (
          <ReviewList
            tourId={tourId}
            reviewList={reviewList}
            onDeleteClick={handleDeleteReviewClick}
            onEditClick={handleEditReviewClick}
            onRateChange={handleRateChange}
          />
        ))}
    </div>
  );
}

export default ReviewContainer;
