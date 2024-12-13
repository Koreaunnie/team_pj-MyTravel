import React, { useState } from "react";

function ReviewAdd({ tourId, onSaveClick }) {
  const [review, setReview] = useState("");

  return (
    <div>
      <textarea value={review} onChange={(e) => setReview(e.target.value)} />
      <button
        className={"btn btn-dark"}
        onClick={() => {
          setReview("");
          onSaveClick(review);
        }}
      >
        후기 작성
      </button>
    </div>
  );
}

export default ReviewAdd;
