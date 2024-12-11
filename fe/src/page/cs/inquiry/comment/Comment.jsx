import "./Comment.css";
import axios from "axios";
import { useState } from "react";

export function Comment(props) {
  const { inquiryId } = props;
  const [comment, setComment] = useState("");

  function handleSaveButton() {
    axios
      .post("/api/cs/inquiry/comment/add", {
        inquiryId,
        comment,
      })
      .then((res) => {
        console.log("댓글 저장 성공:", res);
      })
      .catch((error) => {
        console.error("댓글 저장 실패:", error);
      });
  }

  return (
    <div className={"inquiry body-normal"}>
      <div className={"comment-input"}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className={"btn btn-dark"} onClick={handleSaveButton}>
          댓글 작성
        </button>
      </div>

      <div className={"comment-list"}>
        <div>
          <ul className={"comment-btn"}>
            <li>수정</li>
            <li>삭제</li>
          </ul>

          <ul className={"comment-list-body"}>
            <li>nickname</li>
            <li>댓글 내용</li>
            <li>날짜</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
