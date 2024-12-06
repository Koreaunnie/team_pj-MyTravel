import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../../components/root/Breadcrumb.jsx";
import { Modal } from "../../../components/root/Modal.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";

function FaqView(props) {
  const { id } = useParams();
  const [faq, setFaq] = useState();
  const [backToListModalOpen, setBackToListModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/cs/faq/view/${id}`).then((res) => {
      setFaq(res.data);
    });
  }, []);

  if (faq == null) {
    return <Spinner />;
  }

  const handleDeleteButton = () => {
    axios.delete(`/api/cs/faq/delete/${id}`).then((res) => {
      navigate("/cs/faq/list/");
      alert("FAQ가 삭제되었습니다.");
    });
  };

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
            onClick={() => setEditModalOpen(true)}
          >
            수정
          </button>

          <button
            type={"button"}
            className={"btn btn-warning"}
            onClick={() => setDeleteModalOpen(true)}
          >
            삭제
          </button>
        </div>

        <fieldset>
          <ul>
            <li>
              <label htmlFor="question">질문</label>
              <input
                type="text"
                id={"question"}
                value={faq.question}
                readOnly
              />
            </li>

            <li>
              <label htmlFor="answer">답변</label>
              <textarea id={"answer"} value={faq.answer} readOnly />
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

      {/* 수정 modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onConfirm={() => navigate(`/cs/faq/edit/${id}`)}
        message="FAQ를 수정하시겠습니까?"
        buttonMessage="수정"
      />

      {/*삭제 modal*/}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteButton}
        message="FAQ를 삭제하시겠습니까?"
        buttonMessage="삭제"
      />
    </div>
  );
}

export default FaqView;
