import React from "react";
import ReviewItem from "./ReviewItem.jsx";
import PropTypes from "prop-types";

ReviewItem.prototype = { review: PropTypes.any };

function ReviewList({
  tourId,
  reviewList,
  onDeleteClick,
  onEditClick,
  onRateChange,
}) {
  return (
    <div>
      {reviewList.map((review) => (
        <ReviewItem
          key={review.reviewId}
          review={review}
          onDeleteClick={onDeleteClick}
          onEditClick={onEditClick}
          onRateChange={onRateChange}
        />
      ))}
    </div>
  );
}

export default ReviewList;
