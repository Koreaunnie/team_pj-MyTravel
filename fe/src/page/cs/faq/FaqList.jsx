import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "../../../components/root/Breadcrumb.jsx";
import { Modal } from "../../../components/root/Modal.jsx";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";
import { AuthenticationContext } from "../../../components/context/AuthenticationProvider.jsx";

function FaqList(props) {
  const [faqList, setFaqList] = useState();
  const [addModalOpen, setAddModalOpen] = useState();
  const navigate = useNavigate();
  const { isAdmin, hasAccess } = useContext(AuthenticationContext);

  useEffect(() => {
    axios.get("/api/cs/faq/list").then((res) => setFaqList(res.data));
  }, []);

  if (!faqList || faqList.length === 0) {
    return <Spinner />;
  }

  return (
    <div className={"faq"}>
      <Breadcrumb
        depth1={"고객센터"}
        navigateToDepth1={() => navigate(`/cs/index`)}
        depth2={"자주 묻는 질문"}
        navigateToDepth2={() => navigate(`/cs/faq/list`)}
      />

      <div className={"body-normal"}>
        <div className={"btn-wrap"}>
          {isAdmin && hasAccess && (
            <button
              className={"btn btn-dark"}
              onClick={() => setAddModalOpen(true)}
            >
              작성
            </button>
          )}
        </div>

        <h1>자주 묻는 질문</h1>

        <table className={"table-list"}>
          <thead>
            <tr>
              <th>#</th>
              <th>질문</th>
              <th>작성일</th>
            </tr>
          </thead>

          <tbody>
            {faqList.map((faq) => (
              <tr
                key={faq.id}
                onClick={() => navigate(`/cs/faq/view/${faq.id}`)}
              >
                <td>{faq.id}</td>
                <td>{faq.question}</td>
                <td>{faq.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 추가 modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={() => navigate(`/cs/faq/add`)}
        message="FAQ를 작성하시겠습니까?"
        buttonMessage="작성"
      />
    </div>
  );
}

export default FaqList;
