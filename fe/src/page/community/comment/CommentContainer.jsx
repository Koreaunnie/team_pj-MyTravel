import React, { useEffect, useState } from "react";
import { CommentInput } from "./CommentInput.jsx";
import { CommentList } from "./CommentList.jsx";
import axios from "axios";

function CommentContainer({ communityId, communityWriter }) {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    // 댓글 목록을 가져옵니다.
    axios
      .get(`/api/community/comment/list/${communityId}`, { communityId })
      .then((res) => {
        setCommentList(res.data.commentList);
      })
      .catch((err) => console.error(err));
  }, [communityId]);

  return (
    <div className={"community body-normal"}>
      <CommentInput
        communityId={communityId}
        communityWriter={communityWriter}
      />
      <CommentList communityId={communityId} commentList={commentList} />
    </div>
  );
}

export default CommentContainer;
