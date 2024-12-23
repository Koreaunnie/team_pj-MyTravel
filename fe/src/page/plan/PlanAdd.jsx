import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import "./Plan.css";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { Modal } from "/src/components/root/Modal.jsx";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import { GoogleMapsAdd } from "./GoogleMaps/GoogleMapsAdd.jsx";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import Access from "../../components/context/Access.jsx";

function PlanAdd(props) {
  const [backToListModalOpen, setBackToListModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fields, setFields] = useState([
    {
      date: "",
      time: "",
      schedule: "",
      place: "",
      placeId: "",
      memo: "",
    },
  ]);

  const fieldRefs = useRef([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthenticationContext);

  if (!isAuthenticated) {
    return <Access />;
  }

  // div 입력값을 상태로 업데이트하는 함수
  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...fields];
    updatedFields[index][field] = value;
    setFields(updatedFields);
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
    setFields([
      ...fields,
      {
        date: "",
        time: "",
        schedule: "",
        place: "",
        memo: "",
      },
    ]);

    // 비동기적으로 스크롤 이동
    setTimeout(() => {
      const newFieldIndex = fields.length; // 새로 추가된 필드의 인덱스
      const newFieldRef = fieldRefs.current[newFieldIndex];
      if (newFieldRef) {
        newFieldRef.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 0);
  }

  // - 버튼 클릭 시 필드 삭제
  function handleDeleteField(index) {
    setFields(fields.filter((_, i) => i !== index));

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
      .post("/api/plan/add", {
        title,
        description,
        destination,
        startDate,
        endDate,
        planFieldList: fields, // 필드 배열을 그대로 전달
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          description: message.text,
          type: message.type,
        });
        navigate(`/plan/view/${data.id}`);
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          description: message.text,
          type: message.type,
        });

        if (title.trim().length === 0) {
          setSaveModalOpen(false);
        }
      });
  }

  return (
    <div>
      <div className={"plan-form"}>
        <Breadcrumb
          depth1={"내 여행"}
          navigateToDepth1={() => navigate(`/plan/list`)}
          depth2={"작성"}
          navigateToDepth2={() => navigate(`/plan/add`)}
        />

        <div className={"body-normal"}>
          <div className="btn-wrap">
            <button
              className="btn btn-dark-outline"
              onClick={() => setBackToListModalOpen(true)}
            >
              목록
            </button>

            <button
              className="btn btn-dark"
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
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label htmlFor="title">여행명</label>
                  <span></span>
                </li>

                <li className={"input-design-wrap"}>
                  <input
                    type="text"
                    id="description"
                    required
                    size="100"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                    <label htmlFor="destination">여행지</label>
                  </li>
                  <li className={"input-design-wrap"}>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <label htmlFor="startDate">시작일</label>
                  </li>
                  <li className={"input-design-wrap"}>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    <label htmlFor="endDate">종료일</label>
                  </li>
                </div>
              </ul>
            </div>

            <div className={"plan-body"}>
              {fields.map((field, index) => (
                <ul
                  key={index}
                  className={"plan-body-box"}
                  ref={(el) => (fieldRefs.current[index] = el)}
                >
                  <li className={"input-design-wrap schedule"}>
                    <input
                      type="text"
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
                    <GoogleMapsAdd
                      id="place"
                      onPlaceSelected={(location) =>
                        handlePlaceSelected(index, location)
                      }
                    />
                  </li>

                  <li className={"memo-label"}>
                    <label htmlFor="memo">메모</label>
                    <textarea
                      name="memo"
                      rows="3"
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
    </div>
  );
}

export default PlanAdd;
