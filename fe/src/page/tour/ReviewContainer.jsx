import React, { useEffect, useState } from "react";
import { Stack } from "@chakra-ui/react";
import axios from "axios";
import ReviewAdd from "./ReviewAdd.jsx";
import ReviewList from "./ReviewList.jsx";
import { toaster } from "../../components/ui/toaster.jsx";

function ReviewContainer({ tourId }) {
  const [reviewList, setReviewList] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [paymentCheck, setPaymentCheck] = useState(false);

  useEffect(() => {
    if (!processing) {
      axios
        .get(`/api/review/list/${tourId}`)
        .then((res) => res.data)
        .then((data) => setReviewList(data));
    }
  }, [processing]);

  function handleSaveReviewClick(review) {
    setProcessing(true);
    axios
      .post("/api/review/add", {
        tourId: tourId,
        review: review,
      })
      .then((res) => res.data.message)
      .then((message) => {
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .catch((error) => {
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
    axios.delete(`/api/review/delete/${reviewId}`).finally(() => {
      setProcessing(false);
    });
  }

  function handleEditReviewClick(reviewId, review) {
    setProcessing(true);

    axios
      .put(`/api/review/edit`, { reviewId, review })
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
      <Stack>
        <h2>후기</h2>
        {paymentHistoryCheck() && (
          <ReviewAdd tourId={tourId} onSaveClick={handleSaveReviewClick} />
        )}
        {reviewList.length === 0 ? (
          <p>아직 작성된 후기가 없습니다.</p>
        ) : (
          <ReviewList
            tourId={tourId}
            reviewList={reviewList}
            onDeleteClick={handleDeleteReviewClick}
            onEditClick={handleEditReviewClick}
          />
        )}
      </Stack>
    </div>
  );
}

export default ReviewContainer;
