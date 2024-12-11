import "./Comment.css";
import axios from "axios";
import { useState } from "react";
import { toaster } from "../../../../components/ui/toaster.jsx";
import { CommentList } from "./CommentList.jsx";

export function CommentContainer({ inquiryId }) {
  const [comment, setComment] = useState("");

  function handleSaveButton() {
    axios
      .post("/api/cs/inquiry/comment/add", {
        inquiryId,
        comment,
      })
      .then((res) => {
        toaster.create({
          type: res.data.message.type,
          description: res.data.message.text,
        });
        setComment("");
      })
      .catch((e) => {
        toaster.create({
          type: e.response.data.message.type,
          description: e.response.data.message.text,
        });
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

      <CommentList inquiryId={inquiryId} />
    </div>
  );
}
