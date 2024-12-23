import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../../../components/context/AuthenticationProvider.jsx";
import axios from "axios";
import { toaster } from "../../../components/ui/toaster.jsx";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../../components/root/Modal.jsx";

export function CommentInput({ communityId, communityWriter, fetchComments }) {
  const [comment, setComment] = useState("");
  // const [commentList, setCommentList] = useState([]); // 댓글 목록 상태 추가
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const authentication = useContext(AuthenticationContext);

  // const fetch = () => {
  //   axios
  //     .get(`/api/community/fetch/${communityId}`)
  //     .then((res) => {
  //       console.log(res.data);
  //       setCommentList(res.data.commentList);
  //     })
  //     .catch((err) => console.error(err));
  // };

  const handleCommentSaveClick = () => {
    if (!comment.trim()) {
      toaster.create({
        type: "error",
        description: "댓글을 작성해 주세요.",
      });
      return;
    }

    axios
      .post(`/api/community/comment/write`, { comment, communityId })
      .then((res) => {
        const writeSuccess = res.data.message;
        toaster.create({
          type: writeSuccess.type,
          description: writeSuccess.text,
        });
        fetchComments();
      })
      .finally(() => setComment(""));
  };

  function handleLoginClick() {
    navigate(`/member/login`);
  }

  return (
    <div className={"community-comment"}>
      <div className={"comment-input"}>
        {authentication.isAuthenticated ? (
          <div>
            <label htmlFor="comment">
              {communityWriter + " 님에게 댓글 작성"}
            </label>
            <textarea
              rows={5}
              placeholder="댓글 쓰기"
              id={"comment"}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button className={"btn btn-dark"} onClick={handleCommentSaveClick}>
              댓글 등록
            </button>
          </div>
        ) : (
          <div>
            <textarea
              rows={5}
              placeholder="로그인 후 댓글을 작성하실 수 있습니다."
              onClick={() => setLoginModalOpen(true)}
            />
          </div>
        )}

        {/* 로그인 modal */}
        <Modal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onConfirm={() => navigate(`/member/login`)}
          message="로그인 후 댓글을 작성하실 수 있습니다."
          buttonMessage="로그인"
        />
      </div>
    </div>
  );
}
