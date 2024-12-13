import React from "react";
import ReviewItem from "./ReviewItem.jsx";
import PropTypes from "prop-types";

ReviewItem.prototype = { review: PropTypes.any };

function ReviewList({ tourId, reviewList, onDeleteClick, onEditClick }) {
  return (
    <div>
      {reviewList.map((review) => (
        <ReviewItem
          key={review.reviewId}
          review={review}
          onDeleteClick={onDeleteClick}
          onEditClick={onEditClick}
        />
      ))}
    </div>
  );
}

export default ReviewList;
