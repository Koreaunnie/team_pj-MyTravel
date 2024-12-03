import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";
import "/src/components/root/common.css";
import { Modal } from "../../components/root/Modal.jsx";

function PlanView(props) {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [planFields, setPlanFields] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  // 네이버 공유하기
  const [url, setUrl] = useState(
    "https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&oquery=%EB%84%A4%EC%9D%B4%EB%B2%84+%EA%B0%9C%EB%B0%9C%EC%9E%90%EC%84%BC%ED%84%B0&ie=utf8&query=%EB%84%A4%EC%9D%B4%EB%B2%84+%EA%B0%9C%EB%B0%9C%EC%9E%90%EC%84%BC%ED%84%B0",
  );
  const [title, setTitle] = useState("");

  useEffect(() => {
    // 네이버 공유하기 (현재 페이지의 URL을 url 상태로 설정)
    setUrl(window.location.href);

    axios.get(`/api/plan/view/${id}`).then((res) => {
      // plan 객체
      setPlan(res.data.plan);
      // planFields 배열 (응답이 없으면 빈 배열)
      setPlanFields(res.data.planFields || []);
      // 네이버 공유할 때 title
      setTitle(res.data.plan.title);
    });
  }, []);

  if (plan === null) {
    return <Spinner />;
  }

  // modal 팝업
  const closeModal = () => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
  };

  const handleDeleteButton = () => {
    axios
      .delete(`/api/plan/delete/${id}`)
      .then((res) => {
        navigate(`/plan/list`);
        alert("일정이 삭제되었습니다.");
      })
      .catch()
      .finally();
  };

  // 네이버 공유하기
  const share = () => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const shareURL = `https://share.naver.com/web/shareView?url=${encodedUrl}&title=${encodedTitle}`;
    window.location = shareURL; // Naver 공유 URL로 이동
  };

  return (
    <div className={"body"}>
      <div className={"position-fixed"}>
        <div className={"btn-warp"}>
          <button
            className={"btn btn-dark-outline"}
            onClick={() => navigate(`/plan/list`)}
          >
            목록
          </button>

          <button
            className={"btn btn-dark"}
            onClick={() => setAddModalOpen(true)}
          >
            새 여행 작성
          </button>

          <button
            className={"btn btn-dark"}
            onClick={() => setEditModalOpen(true)}
          >
            수정
          </button>

          <button
            className={"btn btn-warning"}
            onClick={() => setDeleteModalOpen(true)}
          >
            삭제
          </button>
        </div>

        <table className={"head-table"}>
          <thead>
            <tr>
              <th colspan="2" className={"thead-title"}>
                {plan.title}
              </th>
            </tr>
            <tr className={"thead-sub-title-warp"}>
              <th className={"thead-sub-title"}>Destination</th>
              <th className={"thead-sub-title"}>Date</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{plan.destination}</td>
              <td>
                {plan.startDate} ~ {plan.endDate}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <table className={"body-table"}>
        <caption>{plan.description}</caption>

        <thead>
          <tr>
            <th>시간</th>
            <th>일정</th>
            <th>장소</th>
            <th>메모</th>
          </tr>
        </thead>

        <tbody>
          {planFields.map((field) => (
            <tr key={field.id}>
              <th>{field.date}</th>
              <td>{field.time}</td>
              <td>{field.schedule}</td>
              <td>{field.place}</td>
              <td>{field.memo}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 네이버 공유하기 버튼 추가 */}
      <div>
        <span>
          <script
            type="text/javascript"
            src="https://ssl.pstatic.net/share/js/naver_sharebutton.js"
          ></script>
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `new ShareNaver.makeButton({"type": "b"});`,
            }}
          ></script>
        </span>
      </div>

      <div>
        <form id="myform">
          URL입력:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <br />
          Title입력:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
        </form>
        <input type="button" value="네이버 공유하기" onClick={share} />
      </div>

      {/* 추가 modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={() => navigate(`/plan/add`)}
        message="새로운 여행을 작성하시겠습니까?"
        buttonMessage="작성"
      />

      {/* 수정 modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onConfirm={() => navigate(`/plan/edit/${id}`)}
        message="여행을 수정하시겠습니까?"
        buttonMessage="수정"
      />

      {/* 삭제 modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteButton}
        message="정말로 이 여행을 삭제하시겠습니까?"
        buttonMessage="삭제"
      />
    </div>
  );
}

export default PlanView;
