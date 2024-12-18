import React, { useState } from "react";
import { Rating } from "../../components/ui/rating.jsx";
import { Box, Input } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";

function ReviewAdd({ tourId, onSaveClick, onRateChange }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewImg, setReviewImg] = useState([]);

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
      <Box>
        <Field label={"파일"}>
          <Input
            type={"file"}
            accept={"image/*"}
            multiple
            onChange={(e) => setReviewImg(Array.from(e.target.files))}
          />
        </Field>
      </Box>
      <button
        className={"btn btn-blue"}
        onClick={() => {
          // console.log(reviewImg);
          setReview("");
          onSaveClick({ review: review, rating: rating, reviewImg: reviewImg });
        }}
      >
        후기 저장
      </button>
    </div>
  );
}

export default ReviewAdd;
