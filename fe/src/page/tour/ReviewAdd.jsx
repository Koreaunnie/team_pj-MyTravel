import React, { useState } from "react";
import { Rating } from "../../components/ui/rating.jsx";

function ReviewAdd({ tourId, onSaveClick, onRateChange }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewImg, setReviewImg] = useState([]);

  return (
    <div className={"review-add"}>
      <h4>
        <Rating
          defaultValue={5}
          onChange={(e) => {
            // console.log(e);
            onRateChange(e, setRating);
          }}
        />
      </h4>

      <textarea
        className={"review-text"}
        value={review}
        rows={4}
        onChange={(e) => setReview(e.target.value)}
      />

      <div className={"submit-container"}>
        <div>
          <label htmlFor="file">사진 첨부</label>
          <input
            type={"file"}
            id={"file"}
            accept={"image/*"}
            multiple
            onChange={(e) => setReviewImg(Array.from(e.target.files))}
          />
        </div>

        <button
          className={"btn btn-blue"}
          onClick={() => {
            // console.log(reviewImg);
            setReview("");
            onSaveClick({
              review: review,
              rating: rating,
              reviewImg: reviewImg,
            });
          }}
        >
          후기 등록
        </button>
      </div>
    </div>
  );
}

export default ReviewAdd;
