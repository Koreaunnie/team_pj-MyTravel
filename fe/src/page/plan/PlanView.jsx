import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";
import "/src/components/root/common.css";

function PlanView(props) {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [planFields, setPlanFields] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/plan/view/${id}`).then((res) => {
      // plan 객체
      setPlan(res.data.plan);
      // planFields 배열 (응답이 없으면 빈 배열)
      setPlanFields(res.data.planFields || []);
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

  return (
    <div className={"body"}>
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

      <h1>{plan.title}</h1>
      <p>{plan.description}</p>
      <p>{plan.destination}</p>
      <p>{plan.due}</p>

      <table>
        <thead>
          <tr>
            <th>날짜</th>
            <th>시간</th>
            <th>일정</th>
            <th>장소</th>
            <th>메모</th>
          </tr>
        </thead>

        <tbody>
          {planFields.map((field) => (
            <tr key={field.id}>
              <td>{field.date}</td>
              <td>{field.time}</td>
              <td>{field.schedule}</td>
              <td>{field.place}</td>
              <td>{field.memo}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 새 여행 modal */}
      {addModalOpen && (
        <div className={"modal"}>
          <div className={"modal-content"}>
            <div className={"modal-header"}>
              <button
                className="close"
                onClick={closeModal}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>

            <div className={"modal-body"}>
              <p>새로운 여행을 작성하시겠습니까?</p>
            </div>

            <div className={"modal-footer btn-wrap"}>
              <button className={"btn btn-dark-outline"} onClick={closeModal}>
                닫기
              </button>

              <button
                className={"btn btn-dark"}
                onClick={() => navigate(`/plan/add`)}
              >
                작성
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 modal */}
      {editModalOpen && (
        <div className={"modal"}>
          <div className={"modal-content"}>
            <div className={"modal-header"}>
              <button
                className="close"
                onClick={closeModal}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>

            <div className={"modal-body"}>
              <p>이 여행을 수정하시겠습니까?</p>
            </div>

            <div className={"modal-footer btn-wrap"}>
              <button className={"btn btn-dark-outline"} onClick={closeModal}>
                닫기
              </button>

              <button
                className={"btn btn-dark"}
                onClick={() => navigate(`/plan/edit/${id}`)}
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 modal */}
      {deleteModalOpen && (
        <div className={"modal"}>
          <div className={"modal-content"}>
            <div className={"modal-header"}>
              <button
                className="close"
                onClick={closeModal}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>

            <div className={"modal-body"}>
              <p>정말로 이 여행을 삭제하시겠습니까?</p>
            </div>

            <div className={"modal-footer btn-wrap"}>
              <button className={"btn btn-dark-outline"} onClick={closeModal}>
                닫기
              </button>

              <button
                className={"btn btn-warning"}
                onClick={handleDeleteButton}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanView;
