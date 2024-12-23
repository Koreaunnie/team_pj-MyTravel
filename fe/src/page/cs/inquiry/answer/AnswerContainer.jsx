import "./Answer.css";
import { AnswerList } from "./AnswerList.jsx";
import { AnswerInput } from "./AnswerInput.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthenticationContext } from "../../../../components/context/AuthenticationProvider.jsx";

export function AnswerContainer({ inquiryId }) {
  const [answerList, setAnswerList] = useState([]);
  const { isAdmin } = useContext(AuthenticationContext);

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
    <div className={"body-normal"}>
      <AnswerList
        inquiryId={inquiryId}
        answerList={answerList}
        setAnswerList={setAnswerList}
      />

      {isAdmin && (
        <AnswerInput inquiryId={inquiryId} fetchAnswerList={fetchAnswerList} />
      )}
    </div>
  );
}
