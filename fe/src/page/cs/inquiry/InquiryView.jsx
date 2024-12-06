import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../../components/root/Breadcrumb.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";
import "./Inquiry.css";
import { Modal } from "../../../components/root/Modal.jsx";

function InquiryView(props) {
  const { id } = useParams();
  const [inquiry, setInquiry] = useState(null);
  const [backToListModalOpen, setBackToListModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/cs/inquiry/view/${id}`).then((res) => {
      setInquiry(res.data);
    });
  }, []);

  if (inquiry == null) {
    return <Spinner />;
  }

  const handleDeleteButton = () => {
    axios.delete(`/api/cs/inquiry/delete/${id}`).then((res) => {
      navigate("/cs/inquiry/list");
      alert("문의 글이 삭제되었습니다.");
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

        <table className={"table-view"}>
          <thead>
            <tr className={"thead-title"}>
              <th colSpan={2}>{inquiry.title}</th>
            </tr>
            <tr className={"thead-sub-title"}>
              <th>{inquiry.writer}</th>
              <th>{inquiry.inserted}</th>
            </tr>
          </thead>

          <tbody>
            <tr className={"tbody-content"}>
              <td colSpan={2}>{inquiry.content}</td>
            </tr>
            <tr>
              <td colSpan={2}>첨부파일</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 목록 modal */}
      <Modal
        isOpen={backToListModalOpen}
        onClose={() => setBackToListModalOpen(false)}
        onConfirm={() => navigate(`/cs/inquiry/add`)}
        message="목록으로 돌아가면 작성한 내용이 사라집니다."
        buttonMessage="목록"
      />

      {/* 수정 modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onConfirm={() => navigate(`/cs/inquiry/edit/${id}`)}
        message="문의 글을 수정하시겠습니까?"
        buttonMessage="수정"
      />

      {/* 삭제 modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteButton}
        message="문의 글을 삭제하시겠습니까?"
        buttonMessage="삭제"
      />
    </div>
  );
}

export default InquiryView;
