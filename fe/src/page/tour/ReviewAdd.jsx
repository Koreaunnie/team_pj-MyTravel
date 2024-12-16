import React, { useState } from "react";
import { Rating } from "../../components/ui/rating.jsx";

function ReviewAdd({ tourId, onSaveClick, onRateChange }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  return (
    <div>
      <h4>
        별점
        <Rating
          defaultValue={5}
          onChange={(e) => {
            // console.log(e);
            onRateChange(e, setRating);
          }}
        />
      </h4>
      <textarea value={review} onChange={(e) => setReview(e.target.value)} />
      <button
        className={"btn btn-blue"}
        onClick={() => {
          // console.log(review, rating);
          setReview("");
          onSaveClick({ review: review, rating: rating });
        }}
      >
        후기 저장
      </button>
    </div>
  );
}

export default ReviewAdd;
