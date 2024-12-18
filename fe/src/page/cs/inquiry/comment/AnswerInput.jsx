import "./Answer.css";
import React, { useState } from "react";
import axios from "axios";
import { toaster } from "../../../../components/ui/toaster.jsx";

export function AnswerInput({ inquiryId }) {
  const [answer, setAnswer] = useState("");

  function handleSaveButton() {
    axios
      .post("/api/cs/inquiry/answer/add", {
        inquiryId,
        answer,
      })
      .then((res) => {
        toaster.create({
          type: res.data.message.type,
          description: res.data.message.text,
        });
        setAnswer("");
      })
      .catch((e) => {
        toaster.create({
          type: e.response.data.message.type,
          description: e.response.data.message.text,
        });
      });
  }

  return (
    <div className={"inquiry body-normal"}>
      <div className={"answer-input"}>
        <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <button className={"btn btn-dark"} onClick={handleSaveButton}>
          댓글 작성
        </button>
      </div>
    </div>
  );
}
