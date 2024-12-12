import React from "react";
import ReviewItem from "./ReviewItem.jsx";

function ReviewList({ tourId, reviewList }) {
  return (
    <div>
      {reviewList.map((review) => (
        <ReviewItem key={review.reviewId} review={review} />
      ))}
    </div>
  );
}

export default ReviewList;
