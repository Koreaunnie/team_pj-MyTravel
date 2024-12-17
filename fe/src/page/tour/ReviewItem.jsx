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
  const [uploadFiles, setUploadFiles] = useState([]);

  const handleRemoveFile = (fileName) => {
    setRemoveFiles((prev) => [...prev, fileName]);
  };

  const handleFileListChange = (updatedFileList) => {
    setFileList(updatedFileList);
  };

  const handleUploadFilesChange = (e) => {
    const uploaded = Array.from(e.target.files).map((file) => ({
      id: file.name,
      src: URL.createObjectURL(file), // 업로드된 파일의 미리보기 URL 생성
    }));
    setUploadFiles(e.target.files);
    setFileList((prev) => [...prev, ...uploaded]); // 파일 리스트에 추가
  };

  const handleSave = () => {
    // 저장 시 상태 업데이트
    const updatedFileList = fileList.filter(
      (file) => !removeFiles.includes(file.id),
    );
    setFileList(updatedFileList); // 상태 업데이트로 새로고침 없이 반영
    setOpen(false);

    // 외부에 업데이트된 데이터 전달 (필요 시)
    onEditClick(review.reviewId, {
      review: newReview,
      rating: newRating,
      removeFiles,
      uploadFiles,
    });
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
              <Input
                type="file"
                accept={"image/*"}
                multiple
                onChange={handleUploadFilesChange}
              />
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
            <button className={"btn btn-blue"} onClick={handleSave}>
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
