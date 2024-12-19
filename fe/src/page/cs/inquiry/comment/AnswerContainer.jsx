import "./Answer.css";
import { AnswerList } from "./AnswerList.jsx";
import { AnswerInput } from "./AnswerInput.jsx";

export function AnswerContainer({ inquiryId }) {
  return (
    <div className={"inquiry body-normal"}>
      <AnswerInput inquiryId={inquiryId} />
      <AnswerList inquiryId={inquiryId} />
    </div>
  );
}
