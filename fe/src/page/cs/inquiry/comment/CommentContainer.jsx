import "./Comment.css";
import { CommentList } from "./CommentList.jsx";
import { CommentInput } from "./CommentInput.jsx";

export function CommentContainer({ inquiryId }) {
  return (
    <div className={"inquiry body-normal"}>
      <CommentInput inquiryId={inquiryId} />
      <CommentList inquiryId={inquiryId} />
    </div>
  );
}
