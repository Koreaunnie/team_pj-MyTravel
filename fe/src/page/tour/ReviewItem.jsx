import React, { useContext, useState } from "react";
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
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { Rating } from "../../components/ui/rating.jsx";
import { ReviewImageView } from "../../components/Image/ReviewImageView.jsx";
import { ReviewImageEdit } from "../../components/Image/ReviewImageEdit.jsx";
import { Field } from "../../components/ui/field.jsx";
import { Input } from "@chakra-ui/react";

function EditButton({ review, onEditClick, onRateChange }) {
  const [open, setOpen] = useState(false);
  const [newReview, setNewReview] = useState(review.review);
  const [newRating, setNewRating] = useState(review.rating);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [fileList, setFileList] = useState(review.imageList || []);

  const handleRemoveFile = (fileName) => {
    setRemoveFiles((prev) => [...prev, fileName]);
  };

  const handleFileListChange = (updatedFileList) => {
    setFileList(updatedFileList);
  };

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
            <Rating
              value={newRating}
              onChange={(e) => {
                // console.log(newRating);
                onRateChange(e, setNewRating); // 올바른 상태 설정
              }}
            />

            <ReviewImageEdit
              onRemove={handleRemoveFile}
              onFileListChange={handleFileListChange}
              files={fileList}
            />
            <Field>
              <Input type="file" multiple />
            </Field>
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
                onEditClick(review.reviewId, {
                  review: newReview,
                  rating: newRating,
                  removeFiles,
                }); // 새로운 리뷰와 별점을 함께 전달
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

function ReviewItem({ review, onDeleteClick, onEditClick, onRateChange }) {
  const { email, isAdmin } = useContext(AuthenticationContext);

  return (
    <div>
      <h3>{review.writerNickname}</h3>
      <h3>{review.inserted}</h3>
      <p>
        <Rating value={review.rating} readOnly />
      </p>
      <p>{review.review}</p>
      <ReviewImageView files={review.imageList} />
      <div>
        {/*후기 작성자만 버튼 확인 가능: 지금 email 확인 불가*/}
        {(email === review.writerEmail || isAdmin) && (
          <>
            <EditButton
              review={review}
              onEditClick={onEditClick}
              onRateChange={onRateChange}
            />
            <button
              className={"btn btn-warning"}
              onClick={() => onDeleteClick(review.reviewId)}
            >
              삭제
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ReviewItem;
