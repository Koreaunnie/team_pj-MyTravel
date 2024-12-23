import "./Answer.css";
import React, { useContext, useState } from "react";
import axios from "axios";
import { toaster } from "../../../../components/ui/toaster.jsx";
import { formattedDateTime } from "../../../../components/utils/FormattedDateTime.jsx";
import { AuthenticationContext } from "../../../../components/context/AuthenticationProvider.jsx";

export function AnswerList({ inquiryId, answerList, setAnswerList }) {
  const [editingAnswerId, setEditingAnswerID] = useState(null); // 수정 중인 댓글 ID
  const [newAnswer, setNewAnswer] = useState(""); // 수정된 댓글 내용
  // const [processing, setProcessing] = useState(false); // 수정 내용 바로 반영
  // const [updated, setUpdated] = useState(false);
  const { hasAccessByNickName } = useContext(AuthenticationContext);

  // 수정 버튼 클릭 시 해당 댓글을 수정 모드로 설정
  function handleEditButton(answerId, currentAnswer) {
    setEditingAnswerID(answerId);
    setNewAnswer(currentAnswer);
  }

  function handleSaveButton(id) {
    // setProcessing(true);
    axios
      .put(`/api/cs/inquiry/answer/edit`, {
        id: id,
        answer: newAnswer,
      })
      .then((res) => {
        res.data;

        toaster.create({
          type: res.data.message.type,
          description: res.data.message.text,
        });

        //answer update
        setAnswerList((prev) =>
          prev.map((answer) =>
            answer.id === id ? { ...answer, answer: newAnswer } : answer,
          ),
        );
        setEditingAnswerID(null);
        setNewAnswer("");
        // setUpdated(true); // 업데이트 트리거
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  function handleDeleteButton(id) {
    // setProcessing(true);
    axios
      .delete(`/api/cs/inquiry/answer/delete/${id}`)
      .then((res) => {
        toaster.create({
          type: res.data.message.type,
          description: res.data.message.text,
        });
        // setUpdated(true); // 업데이트 트리거
        //삭제 답변 제외
        setAnswerList((prev) => prev.filter((answer) => answer.id !== id));
      })
      .catch((err) => console.error(err))
      .finally(() => {
        // setProcessing(false);
      });
  }

  return (
    <div className={"inquiry-answer"}>
      <p>💬 답변 {answerList.length} 개</p>

      {answerList.map((answer) => (
        <div className={"answer-list"}>
          {editingAnswerId !== answer.id && (
            <ul className={"answer-btn-wrap"}>
              {hasAccessByNickName(answer.writer) && (
                <li onClick={() => handleEditButton(answer.id, answer.answer)}>
                  수정
                </li>
              )}
              {hasAccessByNickName(answer.writer) && (
                <li onClick={() => handleDeleteButton(answer.id)}>삭제</li>
              )}
            </ul>
          )}

          {editingAnswerId === answer.id ? (
            // 수정 모드
            <ul className={"answer-list-body"}>
              <li>
                <textarea
                  rows={"5"}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                />
              </li>

              <li>
                <button
                  className={"btn btn-dark"}
                  onClick={() => {
                    handleSaveButton(answer.id);
                  }}
                >
                  수정
                </button>
              </li>
            </ul>
          ) : (
            // 보기 모드
            <ul key={answer.id} className={"answer-list-body"}>
              <li className={"nickname"}>{answer.memberNickname}</li>
              <li className={"content"}>{answer.answer}</li>
              <li className={"date"}>{formattedDateTime(answer.updated)}</li>
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
