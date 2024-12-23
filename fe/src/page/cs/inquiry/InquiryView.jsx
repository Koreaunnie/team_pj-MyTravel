import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb } from "../../../components/root/Breadcrumb.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";
import "./Inquiry.css";
import { Modal } from "../../../components/root/Modal.jsx";
import { AnswerContainer } from "./answer/AnswerContainer.jsx";
import { toaster } from "../../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../../components/context/AuthenticationProvider.jsx";
import { formattedDateTime } from "../../../components/utils/FormattedDateTime.jsx";

function InquiryView(props) {
  const { id } = useParams();
  const [inquiry, setInquiry] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { hasAccess, isAdmin } = useContext(AuthenticationContext);

  useEffect(() => {
    axios
      .get(`/api/cs/inquiry/view/${id}`)
      .then((res) => {
        setInquiry(res.data.inquiry);
      })
      .catch((error) => {
        toaster.create({
          type: error.response.data.message.type,
          description: error.response.data.message.text,
        });
      });
  }, [id]);

  if (inquiry == null) {
    return <Spinner />;
  }

  const handleDeleteButton = () => {
    axios
      .delete(`/api/cs/inquiry/delete/${id}`, { data: { password } })
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        navigate("/cs/inquiry/list");
      })
      .catch((error) => {
        toaster.create({
          type: "error",
          description: "비밀번호가 일치하지 않습니다.",
        });
        setPassword("");
      });
  };

  return (
    <div className={"inquiry"}>
      <Breadcrumb
        depth1={"고객센터"}
        navigateToDepth1={() => navigate(`/cs/index`)}
        depth2={"문의 게시판"}
        navigateToDepth2={() => navigate(`/cs/inquiry/list`)}
        depth3={"문의글 보기"}
        navigateToDepth3={() => navigate(`/cs/inquiry/view/${id}`)}
      />

      <div className={"body-normal"}>
        <h1>문의 게시판</h1>

        <div className={"btn-wrap"}>
          <button
            type={"button"}
            className={"btn btn-dark-outline"}
            onClick={() => navigate(`/cs/inquiry/list`)}
          >
            목록
          </button>

          {hasAccess(inquiry.writer) && (
            <div>
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
          )}
        </div>

        <table className={"table-view"}>
          <thead>
            <tr className={"thead-title"}>
              <th colSpan={2}>{inquiry.title}</th>
            </tr>
            <tr className={"thead-sub-title"}>
              <th>{inquiry.writerNickname}</th>
              <th>{formattedDateTime(inquiry.inserted)}</th>
            </tr>
          </thead>

          <tbody>
            <tr className={"tbody-content"}>
              <td colSpan={2}>{inquiry.content}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <AnswerContainer inquiryId={inquiry.id} />

      {/* 수정 modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onConfirm={() => navigate(`/cs/inquiry/edit/${id}`)}
        message="문의 글을 수정하시겠습니까?"
        buttonMessage="수정"
      />

      {/* 삭제 modal */}
      {deleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <button
                className="close"
                onClick={() => setDeleteModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>비밀번호를 입력해주세요.</p>
              <input
                type="password"
                className="modal-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="modal-footer btn-wrap">
              <button
                className="btn btn-dark-outline"
                onClick={() => setDeleteModalOpen(false)}
              >
                닫기
              </button>
              <button className="btn btn-dark" onClick={handleDeleteButton}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InquiryView;
