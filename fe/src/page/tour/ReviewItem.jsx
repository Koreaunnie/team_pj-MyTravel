import React, { useState } from "react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";

function EditButton({ review, onEditClick }) {
  const [open, setOpen] = useState(false);
  const [newReview, setNewReview] = useState(review.review);

  return (
    <>
      <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogTrigger asChild>
          <button className={"btn btn-dark"}>수정</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>후기 수정</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
            />
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger>
              <button className={"btn btn-dark-outline"}>취소</button>
            </DialogActionTrigger>
            <button
              className={"btn btn-blue"}
              onClick={() => {
                setOpen(false);
                onEditClick(review.reviewId, newReview);
              }}
            >
              저장
            </button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
}

function ReviewItem({ review, onDeleteClick, onEditClick }) {
  return (
    <div>
      <h3>{review.writerNickname}</h3>
      <h3>{review.inserted}</h3>
      <p>{review.review}</p>
      <div>
        <EditButton review={review} onEditClick={onEditClick} />

        <button
          className={"btn btn-warning"}
          onClick={() => onDeleteClick(review.reviewId)}
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export default ReviewItem;
