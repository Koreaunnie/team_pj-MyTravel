import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";
import { Modal } from "/src/components/root/Modal.jsx";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import * as PropTypes from "prop-types";
import { GoogleMapsEdit } from "./GoogleMaps/GoogleMapsEdit.jsx";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { toaster } from "../../components/ui/toaster.jsx";

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
  const fieldRefs = useRef([]);

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
    const { placeId, address } = location;
    const updatedFields = [...planFields];
    updatedFields[index] = {
      ...updatedFields[index],
      place: address,
      placeId: placeId,
    };
    setPlanFields(updatedFields);
  };

  // + 버튼 클릭 시 새로운 필드 추가
  function handleAddField() {
    setPlanFields((prev) => [
      ...prev,
      {
        date: "",
        time: "",
        schedule: "",
        place: "",
        placeId: "",
        memo: "",
      },
    ]);

    // 비동기적으로 스크롤 이동
    setTimeout(() => {
      const newFieldIndex = planFields.length; // 새로 추가된 필드의 인덱스
      const newFieldRef = fieldRefs.current[newFieldIndex];
      if (newFieldRef) {
        newFieldRef.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 0);
  }

  // - 버튼 클릭 시 필드 삭제
  function handleDeleteField(index) {
    setPlanFields(planFields.filter((_, i) => i !== index));

    // 삭제 후 마지막 필드로 스크롤
    setTimeout(() => {
      const lastFieldIndex = Math.max(0, fields.length - 2); // 삭제 후 마지막 남은 필드
      const lastFieldRef = fieldRefs.current[lastFieldIndex];
      if (lastFieldRef) {
        lastFieldRef.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 0);
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
      .then((res) => {
        const message = res.data.message;
        toaster.create({
          description: message.text,
          type: message.type,
        });
        navigate(`/plan/view/${id}`);
      })
      .catch((e) => {
        const message = e.response.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      });
  }

  return (
    <div className={"plan-form"}>
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

        <h1>여행 일정 작성</h1>
        <h2>하나의 여행에 여러 일정을 추가할 수 있어요.</h2>

        <form className={"plan-container"}>
          <div>
            <ul className={"plan-head"}>
              <li className={"input-design-wrap plan"}>
                <input
                  type="text"
                  id="name"
                  size="50"
                  value={plan.title}
                  onChange={(e) => setPlan({ ...plan, title: e.target.value })}
                />
                <label htmlFor="title">여행명</label>
                <span></span>
              </li>

              <li className={"input-design-wrap"}>
                <input
                  type="text"
                  id="description"
                  size="100"
                  value={plan.description}
                  onChange={(e) =>
                    setPlan({ ...plan, description: e.target.value })
                  }
                />
                <label htmlFor="description">설명</label>
                <span></span>
              </li>

              <div className={"plan-head-info"}>
                <li className={"input-design-wrap"}>
                  <input
                    type="text"
                    id="destination"
                    size="20"
                    value={plan.destination}
                    onChange={
                      (e) => setPlan({ ...plan, destination: e.target.value }) // plan.destination만 변경
                    }
                  />
                  <label htmlFor="destination">여행지</label>
                  <span></span>
                </li>

                <li className={"input-design-wrap"}>
                  <input
                    type="date"
                    id="startDate"
                    value={plan.startDate}
                    onChange={
                      (e) => setPlan({ ...plan, startDate: e.target.value }) // plan.destination만 변경
                    }
                  />
                  <label htmlFor="startDate">시작일</label>
                  <span></span>
                </li>
                <li className={"input-design-wrap"}>
                  <input
                    type="date"
                    id="endDate"
                    value={plan.endDate}
                    onChange={
                      (e) => setPlan({ ...plan, endDate: e.target.value }) // plan.destination만 변경
                    }
                  />
                  <label htmlFor="endDate">종료일</label>
                  <span></span>
                </li>
              </div>
            </ul>
          </div>

          <div className={"plan-body"}>
            {planFields.map((field, index) => (
              <ul
                key={index}
                className={"plan-body-box"}
                ref={(el) => (fieldRefs.current[index] = el)}
              >
                <li className={"input-design-wrap  schedule"}>
                  <input
                    name="schedule"
                    value={field.schedule}
                    onChange={(e) =>
                      handleFieldChange(index, "schedule", e.target.value)
                    }
                  />
                  <label htmlFor="schedule">일정</label>
                </li>

                <div className={"date-time-wrap"}>
                  <li className={"input-design-wrap"}>
                    <input
                      name="date"
                      type="date"
                      value={field.date}
                      onChange={(e) =>
                        handleFieldChange(index, "date", e.target.value)
                      }
                    />
                    <label htmlFor="date">날짜</label>
                  </li>

                  <li className={"input-design-wrap"}>
                    <input
                      name="time"
                      type="time"
                      value={field.time}
                      onChange={(e) =>
                        handleFieldChange(index, "time", e.target.value)
                      }
                    />
                    <label htmlFor="time">시간</label>
                  </li>
                </div>

                <li className={"input-design-wrap place-label"}>
                  <label htmlFor="place">장소</label>
                  <GoogleMapsEdit
                    id="place"
                    initialPlaceIds={[field.placeId]}
                    value={field.place}
                    onPlaceSelected={(location) =>
                      handlePlaceSelected(index, location)
                    }
                  />
                </li>

                <li className={"memo-label"}>
                  <label htmlFor="memo">메모</label>
                  <textarea
                    name="memo"
                    rows={3}
                    value={field.memo}
                    onChange={(e) =>
                      handleFieldChange(index, "memo", e.target.value)
                    }
                  />
                </li>

                <div className={"btn-wrap"}>
                  <button
                    className={"plan-handle-btn"}
                    type="button"
                    onClick={handleAddField}
                  >
                    <FaPlus />
                  </button>
                  <button
                    className={"plan-handle-btn"}
                    type="button"
                    onClick={() => handleDeleteField(index)}
                  >
                    <FaMinus />
                  </button>
                </div>
              </ul>
            ))}
          </div>
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
