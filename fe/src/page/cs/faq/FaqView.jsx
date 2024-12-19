import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb } from "../../../components/root/Breadcrumb.jsx";
import { Modal } from "../../../components/root/Modal.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";
import { toaster } from "../../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../../components/context/AuthenticationProvider.jsx";
import "./Faq.css";

function FaqView(props) {
  const { id } = useParams();
  const [faq, setFaq] = useState();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, hasAccess } = useContext(AuthenticationContext);

  useEffect(() => {
    axios.get(`/api/cs/faq/view/${id}`).then((res) => {
      setFaq(res.data);
    });
  }, []);

  if (faq == null) {
    return <Spinner />;
  }

  const handleDeleteButton = () => {
    axios
      .delete(`/api/cs/faq/delete/${id}`)
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        navigate("/cs/faq/list");
      })
      .catch((e) => {
        const data = e.response.data;
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
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
            onClick={() => navigate(`/cs/faq/list`)}
          >
            목록
          </button>

          {isAdmin && hasAccess && (
            <button
              type={"button"}
              className={"btn btn-dark"}
              onClick={() => setEditModalOpen(true)}
            >
              수정
            </button>
          )}

          {isAdmin && hasAccess && (
            <button
              type={"button"}
              className={"btn btn-warning"}
              onClick={() => setDeleteModalOpen(true)}
            >
              삭제
            </button>
          )}
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
              <textarea id={"answer"} value={faq.answer} rows={15} readOnly />
            </li>
          </ul>
        </fieldset>
      </div>

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
