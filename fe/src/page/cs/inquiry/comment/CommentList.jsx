import "./Comment.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toaster } from "../../../../components/ui/toaster.jsx";

export function CommentList({ inquiryId }) {
  const [commentList, setCommentList] = useState([]);
  const [editingCommentId, setEditingCommentID] = useState(null); // 수정 중인 댓글 ID
  const [newComment, setNewComment] = useState(""); // 수정된 댓글 내용
  const [processing, setProcessing] = useState(false); // 수정 내용 바로 반영

  useEffect(() => {
    if (!processing) {
      axios
        .get(`/api/cs/inquiry/comment/list/${inquiryId}`)
        .then((res) => res.data)
        .then((data) => setCommentList(data));
    }
  }, [processing]);

  // 수정 버튼 클릭 시 해당 댓글을 수정 모드로 설정
  function handleEditButton(commentId, currentComment) {
    setEditingCommentID(commentId);
    setNewComment(currentComment);
  }

  function handleSaveButton(id) {
    setProcessing(true);
    axios
      .put(`/api/cs/inquiry/comment/edit`, {
        id: id,
        comment: newComment,
      })
      .then((res) => {
        res.data;
        setEditingCommentID(null);
        setNewComment("");
        toaster.create({
          type: res.data.message.type,
          description: res.data.message.text,
        });
      })
      .catch((error) => {
        console.error("댓글 수정 실패:", error);
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  function handleDeleteButton(id) {
    setProcessing(true);
    axios
      .delete(`/api/cs/inquiry/comment/delete/${id}`)
      .then((res) => {
        toaster.create({
          type: res.data.message.type,
          description: res.data.message.text,
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  return (
    <div className={"inquiry body-normal"}>
      <div className={"comment-list"}>
        {commentList.map((comment) => (
          <div>
            <ul className={"comment-btn"}>
              <li
                className={"comment-btn-edit"}
                onClick={() => handleEditButton(comment.id, comment.comment)}
              >
                수정
              </li>

              <li
                className={"comment-btn-delete"}
                onClick={() => handleDeleteButton(comment.id)}
              >
                삭제
              </li>
            </ul>

            {editingCommentId === comment.id ? (
              // 수정 모드
              <div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  className={"btn btn-dark"}
                  onClick={() => {
                    handleSaveButton(comment.id);
                  }}
                >
                  수정
                </button>
              </div>
            ) : (
              // 보기 모드
              <ul key={comment.id} className={"comment-list-body"}>
                <li>{comment.memberNickname}</li>
                <li>{comment.comment}</li>
                <li>{comment.updated}</li>
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
