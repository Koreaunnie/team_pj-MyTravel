import "./Answer.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toaster } from "../../../../components/ui/toaster.jsx";
import { formattedDateTime } from "../../../../components/utils/FormattedDateTime.jsx";

export function AnswerList({ inquiryId }) {
  const [answerList, setAnswerList] = useState([]);
  const [editingAnswerId, setEditingAnswerID] = useState(null); // 수정 중인 댓글 ID
  const [newAnswer, setNewAnswer] = useState(""); // 수정된 댓글 내용
  const [processing, setProcessing] = useState(false); // 수정 내용 바로 반영
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (!processing) {
      axios
        .get(`/api/cs/inquiry/answer/list/${inquiryId}`)
        .then((res) => res.data)
        .then((data) => {
          setAnswerList(data);
          setUpdated(false);
        });
    }
  }, [processing]);

  // 수정 버튼 클릭 시 해당 댓글을 수정 모드로 설정
  function handleEditButton(answerId, currentAnswer) {
    setEditingAnswerID(answerId);
    setNewAnswer(currentAnswer);
  }

  function handleSaveButton(id) {
    setProcessing(true);
    axios
      .put(`/api/cs/inquiry/answer/edit`, {
        id: id,
        answer: newAnswer,
      })
      .then((res) => {
        res.data;
        setEditingAnswerID(null);
        setNewAnswer("");
        setUpdated(true); // 업데이트 트리거
        toaster.create({
          type: res.data.message.type,
          description: res.data.message.text,
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  function handleDeleteButton(id) {
    setProcessing(true);
    axios
      .delete(`/api/cs/inquiry/answer/delete/${id}`)
      .then((res) => {
        toaster.create({
          type: res.data.message.type,
          description: res.data.message.text,
        });
        setUpdated(true); // 업데이트 트리거
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  return (
    <div className={"inquiry-answer body-normal"}>
      {answerList.map((answer) => (
        <div className={"answer-list"}>
          {editingAnswerId !== answer.id && (
            <ul className={"answer-btn-wrap"}>
              <li onClick={() => handleEditButton(answer.id, answer.answer)}>
                수정
              </li>
              <li onClick={() => handleDeleteButton(answer.id)}>삭제</li>
            </ul>
          )}

          {editingAnswerId === answer.id ? (
            // 수정 모드
            <div className={"answer-list-body"}>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              />
              <button
                className={"btn btn-dark"}
                onClick={() => {
                  handleSaveButton(answer.id);
                }}
              >
                수정
              </button>
            </div>
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
