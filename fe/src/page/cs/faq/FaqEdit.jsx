import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../../components/root/Breadcrumb.jsx";
import { Modal } from "../../../components/root/Modal.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";

function FaqEdit(props) {
  const { id } = useParams();
  const [faq, setFaq] = useState();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [backToListModalOpen, setBackToListModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/cs/faq/view/${id}`).then((res) => {
      setFaq(res.data);
      setQuestion(res.data.question);
      setAnswer(res.data.answer);
    });
  }, [id]);

  const handleSaveButton = () => {
    axios
      .put("/api/cs/faq/update", {
        id,
        question,
        answer,
      })
      .then((res) => {
        navigate("/cs/faq/list");
        alert("수정되었습니다.");
      });
  };

  if (faq == null) {
    return <Spinner />;
  }

  return (
    <div className={"faq"}>
      <Breadcrumb
        depth1={"고객센터"}
        navigateToDepth1={() => navigate(`/cs/index`)}
        depth2={"자주 묻는 질문"}
        navigateToDepth2={() => navigate(`/cs/faq/list`)}
        depth3={"상세보기"}
        navigateToDepth3={() => navigate(`/cs/faq/view/${id}`)}
      />
      <div className={"body-normal"}>
        <div>
          <button
            type={"button"}
            className={"btn btn-dark-outline"}
            onClick={() => setBackToListModalOpen(true)}
          >
            목록
          </button>

          <button
            type={"button"}
            className={"btn btn-dark"}
            onClick={() => setSaveModalOpen(true)}
          >
            저장
          </button>
        </div>

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
      </div>

      {/* 목록 modal */}
      <Modal
        isOpen={backToListModalOpen}
        onClose={() => setBackToListModalOpen(false)}
        onConfirm={() => navigate(`/cs/faq/list`)}
        message="목록으로 돌아가면 작성한 내용이 사라집니다."
        buttonMessage="목록"
      />

      {/* 저장 modal */}
      <Modal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onConfirm={handleSaveButton}
        message="FAQ를 저장하시겠습니까?"
        buttonMessage="저장"
      />
    </div>
  );
}

export default FaqEdit;
