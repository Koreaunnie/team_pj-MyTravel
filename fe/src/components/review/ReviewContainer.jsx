import React, { useEffect, useState } from "react";
import ReviewAdd from "../../page/tour/ReviewAdd.jsx";
import { Stack } from "@chakra-ui/react";
import ReviewList from "../../page/tour/ReviewList.jsx";
import axios from "axios";
import { toaster } from "../ui/toaster.jsx";

function ReviewContainer({ tourId }) {
  const [reviewList, setReviewList] = useState([]);
  const [processing, setProcessing] = useState(false);

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
      .finally(() => {
        setProcessing(false);
      });
  }

  // function handleDeleteReviewClick(reviewId){
  //   setProcessing(true)
  //   axios
  //     .delete(`/api/review/delete/${reviewId}`)
  //     .finally(()=>{
  //       setProcessing(false);
  //     })
  // }

  return (
    <div>
      <Stack>
        <h2>후기</h2>
        <ReviewAdd tourId={tourId} onSaveClick={handleSaveReviewClick} />
        <ReviewList tourId={tourId} reviewList={reviewList} />
      </Stack>
    </div>
  );
}

export default ReviewContainer;
