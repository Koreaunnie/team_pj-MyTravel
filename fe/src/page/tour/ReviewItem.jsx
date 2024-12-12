import React from "react";

function ReviewItem({ review }) {
  return (
    <div>
      <h3>{review.writerNickname}</h3>
      <h3>{review.inserted}</h3>
      <p>{review.review}</p>
    </div>
  );
}

export default ReviewItem;
