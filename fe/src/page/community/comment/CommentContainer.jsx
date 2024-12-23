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
    <div>
      <CommentList
        communityId={communityId}
        commentList={commentList}
        setCommentList={setCommentList}
        fetchComments={fetchComments}
      />

      <CommentInput
        communityId={communityId}
        communityWriter={communityWriter}
        fetchComments={fetchComments}
      />
    </div>
  );
}

export default CommentContainer;
