import React, { useState } from "react";
import { Rating } from "../../components/ui/rating.jsx";

function ReviewAdd({ tourId, onSaveClick }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  return (
    <div>
      <h4>
        별점
        <Rating defaultValue={5} onChange={(e) => setRating(e)} />
      </h4>
      <textarea value={review} onChange={(e) => setReview(e.target.value)} />
      <button
        className={"btn btn-blue"}
        onClick={() => {
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
