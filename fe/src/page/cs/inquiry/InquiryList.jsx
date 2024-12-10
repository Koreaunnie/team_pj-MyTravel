import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../../components/root/Breadcrumb.jsx";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../../components/root/Modal.jsx";

function InquiryList(props) {
  const [inquiryList, setInquiryList] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/cs/inquiry/list").then((res) => setInquiryList(res.data));
  }, []);

  if (!inquiryList || inquiryList.length === 0) {
    return <Spinner />;
  }

  return (
    <div className={"inquiry"}>
      <Breadcrumb
        depth1={"고객센터"}
        navigateToDepth1={() => navigate(`/cs/index`)}
        depth2={"문의 게시판"}
        navigateToDepth2={() => navigate(`/cs/inquiry/list`)}
      />

      <div className={"body-normal"}>
        <div className={"btn-wrap"}>
          <button
            className={"btn btn-dark"}
            onClick={() => setAddModalOpen(true)}
          >
            작성
          </button>

          <button
            className={"btn btn-blue"}
            // TODO
            // onClick={}
          >
            내가 쓴 글
          </button>
        </div>

        <h1>문의하기</h1>

        <table className={"table-list"}>
          <thead>
            <tr>
              <th>#</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>

          <tbody>
            {inquiryList.map((inquiry) => (
              <tr
                key={inquiry.id}
                onClick={() => navigate(`/cs/inquiry/view/${inquiry.id}`)}
              >
                <td>{inquiry.id}</td>
                <td>{inquiry.title}</td>
                <td>{inquiry.writer}</td>
                <td>{inquiry.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 추가 modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={() => navigate(`/cs/inquiry/add`)}
        message="문의 글을 작성하시겠습니까?"
        buttonMessage="작성"
      />
    </div>
  );
}

export default InquiryList;
