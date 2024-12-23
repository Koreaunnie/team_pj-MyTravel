import "./Answer.css";
import { AnswerList } from "./AnswerList.jsx";
import { AnswerInput } from "./AnswerInput.jsx";
import { useEffect, useState } from "react";
import axios from "axios";

export function AnswerContainer({ inquiryId }) {
  const [answerList, setAnswerList] = useState([]);

  const fetchAnswerList = () => {
    axios
      .get(`/api/cs/inquiry/answer/list/${inquiryId}`)
      .then((res) => setAnswerList(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchAnswerList();
  }, [inquiryId]);

  return (
    <div className={"inquiry body-normal"}>
      <AnswerInput inquiryId={inquiryId} fetchAnswerList={fetchAnswerList} />
      <AnswerList
        inquiryId={inquiryId}
        answerList={answerList}
        setAnswerList={setAnswerList}
      />
    </div>
  );
}
