import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb } from "../../../components/root/Breadcrumb.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../../components/root/Modal.jsx";
import { AuthenticationContext } from "../../../components/context/AuthenticationProvider.jsx";
import { CiLock } from "react-icons/ci";

function InquiryList(props) {
  const { nickname } = useContext(AuthenticationContext);
  const [inquiryList, setInquiryList] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [showMyInquiries, setShowMyInquiries] = useState(false); // 내가 쓴 글 여부
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/cs/inquiry/list").then((res) => {
      setInquiryList(res.data);
      console.log(res.data);
    });
  }, []);

  // 내가 쓴 글만 필터링
  const filteredInquiries = showMyInquiries
    ? inquiryList.filter((inquiry) => inquiry.writer === nickname)
    : inquiryList;

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
            className={"btn btn-blue"}
            onClick={() => setAddModalOpen(true)}
          >
            작성
          </button>

          <button
            className={"btn btn-dark"}
            onClick={() => setShowMyInquiries((prev) => !prev)} // 내가 쓴 글 필터 토글
          >
            {showMyInquiries ? "전체글" : "내가 쓴 글"}
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
            {filteredInquiries.map((inquiry) => (
              <tr
                key={inquiry.id}
                onClick={() => navigate(`/cs/inquiry/view/${inquiry.id}`)}
              >
                <td>{inquiry.id}</td>
                {inquiry.secret ? (
                  <td className={"secret"}>
                    <span className={"icon"}>
                      <CiLock />
                    </span>
                    비밀글입니다.
                  </td>
                ) : (
                  <td>{inquiry.title}</td>
                )}
                <td>{inquiry.writerNickname}</td>
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
