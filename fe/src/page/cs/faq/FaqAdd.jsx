import React, { useState } from "react";
import { Breadcrumb } from "../../../components/root/Breadcrumb.jsx";
import { Modal } from "../../../components/root/Modal.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FaqAdd(props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [backToListModalOpen, setBackToListModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleSaveButton = () => {
    axios
      .post("/api/cs/faq/add", {
        question,
        answer,
      })
      .then((res) => {
        res.data;
        navigate("/cs/faq/list");
        alert("faq가 작성 되었습니다.");
      });
  };

  return (
    <div className={"faq"}>
      <Breadcrumb
        depth1={"고객센터"}
        navigateToDepth1={() => navigate(`/cs/index`)}
        depth2={"자주 묻는 질문"}
        navigateToDepth2={() => navigate(`/cs/faq/list`)}
        depth3={"작성"}
        navigateToDepth3={() => navigate(`/cs/faq/add`)}
      />

      <div className={"body-normal"}>
        <div>
          <fieldset>
            <ul>
              <li>
                <label htmlFor="question">질문</label>
                <input
                  type="text"
                  id={"question"}
                  required
                  maxLength={50}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </li>

              <li>
                <label htmlFor="answer">답변</label>
                <textarea
                  id={"answer"}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </li>
            </ul>
          </fieldset>

          <div className={"btn-wrap"}>
            <button
              className={"btn btn-dark-outline"}
              onClick={() => setBackToListModalOpen(true)}
            >
              목록
            </button>

            <button
              className={"btn btn-dark"}
              onClick={() => setSaveModalOpen(true)}
            >
              등록
            </button>
          </div>
        </div>
      </div>

      {/* 목록 modal */}
      <Modal
        isOpen={backToListModalOpen}
        onClose={() => setBackToListModalOpen(false)}
        onConfirm={() => navigate(`/cs/inquiry/list`)}
        message="목록으로 돌아가면 작성한 내용이 사라집니다."
        buttonMessage="목록"
      />

      {/* 저장 modal */}
      <Modal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onConfirm={handleSaveButton}
        message="FAQ를 등록하시겠습니까?"
        buttonMessage="등록"
      />
    </div>
  );
}

export default FaqAdd;
