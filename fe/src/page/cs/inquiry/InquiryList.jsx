import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb } from "../../../components/root/Breadcrumb.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../../components/root/Modal.jsx";
import { AuthenticationContext } from "../../../components/context/AuthenticationProvider.jsx";
import { CiLock } from "react-icons/ci";
import { toaster } from "../../../components/ui/toaster.jsx";

function InquiryList(props) {
  const { nickname, isAuthenticated } = useContext(AuthenticationContext);
  const [inquiryList, setInquiryList] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [showMyInquiries, setShowMyInquiries] = useState(false); // 내가 쓴 글 여부
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/cs/inquiry/list").then((res) => {
      setInquiryList(res.data);
    });
  }, []);

  // 로그인 안 했을 때 작성 버튼 클릭하면 로그인 유도
  const checkLoginOrNot = () => {
    if (isAuthenticated) {
      setAddModalOpen(true);
    } else {
      toaster.create({
        type: "error",
        description: "로그인 후 문의글 작성이 가능합니다.",
      });
    }
  };

  // 내가 쓴 글만 필터링
  const filteredInquiries = showMyInquiries
    ? inquiryList.filter((inquiry) => inquiry.writerNickname === nickname)
    : inquiryList;

  // 비밀글 여부 확인
  const checkSecretOrNot = (inquiry) => {
    if (inquiry.secret && inquiry.writerNickname != nickname) {
      toaster.create({
        type: "warning",
        description: "비공개 문의내역은 작성자 본인만 확인하실 수 있습니다.",
      });
    } else {
      navigate(`/cs/inquiry/view/${inquiry.id}`);
    }
  };

  // 날짜 포맷팅
  const formattedDate = (props) => {
    const date = new Date(props);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 해줘야 함
    const day = String(date.getDate()).padStart(2, "0"); // 두 자릿수로 맞추기 위해 padStart 사용

    return `${year}-${month}-${day}`;
  };

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
          <button className={"btn btn-blue"} onClick={checkLoginOrNot}>
            작성
          </button>

          {isAuthenticated && (
            <button
              className={"btn btn-dark"}
              onClick={() => setShowMyInquiries((prev) => !prev)} // 내가 쓴 글 필터 토글
            >
              {showMyInquiries ? "전체글" : "내가 쓴 글"}
            </button>
          )}
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
              <tr key={inquiry.id} onClick={() => checkSecretOrNot(inquiry)}>
                <td>{inquiry.id}</td>
                {inquiry.secret ? (
                  <td className={"title-center secret"}>
                    <span className={"icon"}>
                      <CiLock />
                    </span>
                    비밀글입니다.
                  </td>
                ) : (
                  <td className={"title-center"}>{inquiry.title}</td>
                )}
                <td>{inquiry.writerNickname}</td>
                <td>{formattedDate(inquiry.updated)}</td>
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
