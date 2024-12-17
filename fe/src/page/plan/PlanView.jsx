import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";
import "/src/components/root/common.css";
import { Modal } from "../../components/root/Modal.jsx";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import { toaster } from "../../components/ui/toaster.jsx";

import { GoogleMapsView } from "./GoogleMaps/GoogleMapsView.jsx";

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

  const groupByDate = (fields) => {
    return fields.reduce((acc, field) => {
      const date = field.date; // 날짜를 기준으로 그룹화
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(field);
      return acc;
    }, {});
  };

  const groupedPlanFields = groupByDate(planFields);

  const handleDeleteButton = () => {
    axios
      .delete(`/api/plan/delete/${id}`)
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        navigate(`/plan/list`);
      })
      .catch((e) => {
        const data = e.response.data;
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
      })
      .finally();
  };

  const handleExcelDownload = () => {
    axios
      .post(`/api/plan/view/saveExcel/${id}`, { id })
      .then((res) => {
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "my_plan.xlsx"; // 파일 이름 설정
        link.click(); // 링크 클릭으로 다운로드
      })
      .catch((e) => {
        console.error("엑셀 다운로드 중 오류가 발생했습니다.", e);
      });
  };

  return (
    <div className={"plan"}>
      <Breadcrumb
        depth1={"내 여행"}
        navigateToDepth1={() => navigate(`/plan/list`)}
        depth2={plan.title}
        navigateToDepth2={() => navigate(`/plan/view/${id}`)}
      />

      <div className={"body"}>
        <div className={"plan-view-container"}>
          <div className={"plan-view-header"}>
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

              <button type={"button"} onClick={handleExcelDownload}>
                엑셀로 저장
              </button>
            </div>

            <div>
              <h3>{plan.title}</h3>
              <h5>{plan.description}</h5>
            </div>

            <div className={"plan-view-header-right"}>
              <ul>
                <li>
                  <ul>
                    <li className={"font-bold"}>Destination</li>
                    <li>{plan.destination}</li>
                  </ul>
                </li>
                <li>
                  <ul>
                    <li className={"font-bold"}>Date</li>
                    <li>
                      {plan.startDate} ~ {plan.endDate}
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

          <div className={"plan-view-map"}>
            <GoogleMapsView
              placeIds={planFields.map((field) => field.placeId)}
            />
          </div>

          <div className={"plan-view-table"}>
            {Object.entries(groupedPlanFields).map(([date, fields]) => (
              <table key={date} className="table-group">
                <thead>
                  <tr className="table-group-date">
                    <th colSpan="4">{date}</th>
                  </tr>
                  <tr className="table-group-header">
                    <th>시간</th>
                    <th>일정</th>
                    <th>장소</th>
                    <th>메모</th>
                  </tr>
                </thead>

                <tbody>
                  {fields.map((field) => (
                    <tr key={field.id} className="data-row">
                      <td>{field.time}</td>
                      <td>{field.schedule}</td>
                      <td>{field.place}</td>
                      <td>{field.memo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
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
    </div>
  );
}

export default PlanView;
