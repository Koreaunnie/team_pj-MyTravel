import "./Comment.css";
import { useEffect, useState } from "react";
import axios from "axios";

export function CommentList({ inquiryId }) {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/cs/inquiry/comment/list/${inquiryId}`)
      .then((res) => res.data)
      .then((data) => setCommentList(data));
  }, []);

  return (
    <div className={"inquiry body-normal"}>
      <div className={"comment-list"}>
        {commentList.map((comment) => (
          <div>
            <ul className={"comment-btn"}>
              <li>수정</li>
              <li>삭제</li>
            </ul>

            <ul key={comment.id} className={"comment-list-body"}>
              <li>{comment.memberNickname}</li>
              <li>{comment.comment}</li>
              <li>{comment.updated}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
