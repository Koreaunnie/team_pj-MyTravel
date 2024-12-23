import React from "react";
import { CommentInput } from "./CommentInput.jsx";
import { CommentList } from "./CommentList.jsx";

function CommentContainer({
  communityId,
  communityWriter,
  commentList,
  fetchComments,
  setCommentList,
}) {
  return (
    <div className={"community body-normal"}>
      <CommentInput
        communityId={communityId}
        communityWriter={communityWriter}
        fetchComments={fetchComments}
      />
      <CommentList
        communityId={communityId}
        commentList={commentList}
        setCommentList={setCommentList}
        fetchComments={fetchComments}
      />
    </div>
  );
}

export default CommentContainer;
