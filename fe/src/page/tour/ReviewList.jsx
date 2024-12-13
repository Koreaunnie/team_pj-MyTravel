import React from "react";
import ReviewItem from "./ReviewItem.jsx";
import PropTypes from "prop-types";

ReviewItem.prototype = { review: PropTypes.any };

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
