import React, { useEffect, useState } from "react";
import { CommentInput } from "./CommentInput.jsx";
import { CommentList } from "./CommentList.jsx";
import axios from "axios";
import { toaster } from "../../../components/ui/toaster.jsx";

function CommentContainer({ communityId, communityWriter }) {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    // 댓글 목록을 가져옵니다.
    axios
      .get(`/api/community/view/${communityId}`)
      .then((res) => {
        setCommentList(res.data.commentList);
      })
      .catch((err) => console.error(err));
  }, [communityId]);

  // 댓글 목록을 다시 가져오는 함수
  const fetch = () => {
    axios
      .get(`/api/community/fetch/${communityId}`)
      .then((res) => {
        setCommentList(res.data.commentList);
      })
      .catch((err) => console.error(err));
  };

  const handleCommentUpdateClick = (id) => {
    const updatedComment = commentContent[list.id]; // 해당 댓글의 수정된 내용을 가져옴
    // 수정된 댓글 가져오기
    axios
      .put(`/api/community/comment/edit/${id}`, { comment: updatedComment })
      .then((e) => {
        const updateSuccess = e.data.message;
        toaster.create({
          type: updateSuccess.type,
          description: updateSuccess.text,
        });
        fetch();
      })
      .catch((e) => {
        const updateFailure = e.request.response;
        const parsingKey = JSON.parse(updateFailure);
        const type = parsingKey.message.type;
        const text = parsingKey.message.text;
        toaster.create({
          type: type,
          description: text,
        });
      });
  };

  const handleCommentDeleteClick = (id) => {
    axios
      .delete(`/api/community/comment/delete/${id}`)
      .then((e) => {
        const deleteSuccess = e.data.message;
        toaster.create({
          type: deleteSuccess.type,
          description: deleteSuccess.text,
        });
        fetch();
      })
      .catch((e) => {
        const deleteFailure = e.request.response;
        const parsingKey = JSON.parse(deleteFailure);
        const type = parsingKey.message.type;
        const text = parsingKey.message.text;
        toaster.create({
          type: type,
          description: text,
        });
      });
  };

  return (
    <div className={"community body-normal"}>
      <CommentInput
        communityId={communityId}
        communityWriter={communityWriter}
      />
      <CommentList
        communityId={communityId}
        commentList={commentList}
        onEditClick={handleCommentUpdateClick}
        onDeleteClick={handleCommentDeleteClick}
      />
    </div>
  );
}

export default CommentContainer;
