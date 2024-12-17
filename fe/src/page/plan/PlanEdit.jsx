import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";
import { Modal } from "/src/components/root/Modal.jsx";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import * as PropTypes from "prop-types";
import { GoogleMapsEdit } from "./GoogleMaps/GoogleMapsEdit.jsx";

GoogleMapsEdit.propTypes = {
  id: PropTypes.string,
  onPlaceSelected: PropTypes.func,
};

function PlanEdit(props) {
  const { id } = useParams();
  const [backToListModalOpen, setBackToListModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [plan, setPlan] = useState({
    title: "",
    description: "",
    destination: "",
    startDate: "",
    endDate: "",
  });
  const [planFields, setPlanFields] = useState([
    {
      date: "",
      time: "",
      schedule: "",
      place: "",
      placeId: "",
      memo: "",
    },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/plan/view/${id}`).then((res) => {
      setPlan(res.data.plan);
      setPlanFields(res.data.planFields);
    });
  }, []);

  if (plan === null) {
    return <Spinner />;
  }

  // field 입력값을 상태로 업데이트하는 함수
  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...planFields];
    updatedFields[index][field] = value;
    setPlanFields(updatedFields);
  };

  const handlePlaceSelected = (index, location) => {
    // location 객체에서 필요한 정보만 추출
    const { placeId, address, lat, lng } = location;
    // 필요한 정보만 저장
    handleFieldChange(index, "place", `${address}`);
    handleFieldChange(index, "placeId", `${placeId}`);
  };

  // + 버튼 클릭 시 새로운 필드 추가
  function handleAddField() {
    setPlanFields([
      ...planFields,
      {
        date: "",
        time: "",
        schedule: "",
        place: "",
        memo: "",
      },
    ]);
  }

  // - 버튼 클릭 시 필드 삭제
  function handleDeleteField(index) {
    setPlanFields(planFields.filter((_, i) => i !== index));
  }

  // 저장 폼 제출 처리 함수
  function handleSaveButton() {
    axios
      .put("/api/plan/update", {
        id: id,
        title: plan.title,
        description: plan.description,
        destination: plan.destination,
        startDate: plan.startDate,
        endDate: plan.endDate,
        planFieldList: planFields, // 필드 배열을 그대로 전달
      })
      .then((res) => navigate(`/plan/view/${id}`))
      .then(() => alert("일정이 수정되었습니다."))
      .catch((error) => alert("수정에 실패했습니다."))
      .finally();
  }

  return (
    <div className={"plan"}>
      <Breadcrumb
        depth1={"내 여행"}
        navigateToDepth1={() => navigate(`/plan/list`)}
        depth2={"수정"}
        navigateToDepth2={() => navigate(`/plan/edit/${id}`)}
      />

      <div className={"body-normal"}>
        <div className={"btn-wrap"}>
          <button
            className={"btn btn-dark-outline"}
            onClick={() => setBackToListModalOpen(true)}
          >
            목록
          </button>

          <button
            className={"btn btn-dark"}
            onClick={() => setSaveModalOpen(true)}
          >
            저장
          </button>
        </div>

        <h1>일정 수정</h1>

        <form className={"plan-container"}>
          <fieldset className={"plan-header"}>
            <ul className={"title"}>
              <li>
                <label htmlFor="title">여행명</label>
                <input
                  type="text"
                  id="name"
                  size="50"
                  value={plan.title}
                  onChange={(e) => setPlan({ ...plan, title: e.target.value })}
                />
              </li>

              <li>
                <label htmlFor="description">설명</label>
                <input
                  type="text"
                  id="description"
                  size="100"
                  value={plan.description}
                  onChange={(e) =>
                    setPlan({ ...plan, description: e.target.value })
                  }
                />
              </li>

              <li>
                <label htmlFor="destination">여행지</label>
                <input
                  type="text"
                  id="destination"
                  size="20"
                  placeholder="어디로 떠나시나요?"
                  value={plan.destination}
                  onChange={
                    (e) => setPlan({ ...plan, destination: e.target.value }) // plan.destination만 변경
                  }
                />
              </li>
            </ul>

            <ul className={"period"}>
              <li>
                <label htmlFor="startDate">시작일</label>
                <input
                  type="date"
                  id="startDate"
                  value={plan.startDate}
                  onChange={
                    (e) => setPlan({ ...plan, startDate: e.target.value }) // plan.destination만 변경
                  }
                />
              </li>
              <li>
                <label htmlFor="endDate">종료일</label>
                <input
                  type="date"
                  id="endDate"
                  value={plan.endDate}
                  onChange={
                    (e) => setPlan({ ...plan, endDate: e.target.value }) // plan.destination만 변경
                  }
                />
              </li>
            </ul>
          </fieldset>

          <fieldset className={"plan-body"}>
            {planFields.map((field, index) => (
              <div key={index}>
                <label htmlFor="date">날짜</label>
                <input
                  name="date"
                  type="date"
                  value={field.date}
                  onChange={(e) =>
                    handleFieldChange(index, "date", e.target.value)
                  }
                />

                <label htmlFor="time">시간</label>
                <input
                  name="time"
                  type="time"
                  value={field.time}
                  onChange={(e) =>
                    handleFieldChange(index, "time", e.target.value)
                  }
                />

                <label htmlFor="schedule">일정명</label>
                <input
                  name="schedule"
                  value={field.schedule}
                  onChange={(e) =>
                    handleFieldChange(index, "schedule", e.target.value)
                  }
                />

                <label htmlFor="place">장소</label>
                <GoogleMapsEdit
                  id="place"
                  initialPlaceIds={[field.placeId]}
                  onPlaceSelected={(location) =>
                    handlePlaceSelected(index, location)
                  }
                />

                <label htmlFor="memo">메모</label>
                <textarea
                  name="memo"
                  value={field.memo}
                  onChange={(e) =>
                    handleFieldChange(index, "memo", e.target.value)
                  }
                />

                <div className={"btn-wrap"}>
                  <button
                    className={"btn btn-dark"}
                    type="button"
                    onClick={handleAddField}
                  >
                    +
                  </button>
                  <button
                    className={"btn btn-dark"}
                    type="button"
                    onClick={() => handleDeleteField(index)}
                  >
                    -
                  </button>
                </div>
              </div>
            ))}
          </fieldset>
        </form>

        {/* 목록 modal */}
        <Modal
          isOpen={backToListModalOpen}
          onClose={() => setBackToListModalOpen(false)}
          onConfirm={() => navigate(`/plan/list`)}
          message="목록으로 돌아가면 작성한 내용이 사라집니다."
          buttonMessage="목록"
        />

        {/* 저장 modal */}
        <Modal
          isOpen={saveModalOpen}
          onClose={() => setSaveModalOpen(false)}
          onConfirm={handleSaveButton}
          message="여행을 저장하시겠습니까?"
          buttonMessage="저장"
        />
      </div>
    </div>
  );
}

export default PlanEdit;
