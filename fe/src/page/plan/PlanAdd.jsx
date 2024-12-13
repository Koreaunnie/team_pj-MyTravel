import React, { useState } from "react";
import axios from "axios";
import "./Plan.css";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { Modal } from "/src/components/root/Modal.jsx";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import { GoogleMaps } from "./GoogleMaps/GoogleMaps.jsx";

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
      memo: "",
    },
  ]);

  const navigate = useNavigate();

  // div 입력값을 상태로 업데이트하는 함수
  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...fields];
    updatedFields[index][field] = value;
    setFields(updatedFields);
  };

  const handlePlaceSelected = (index, location) => {
    // location 객체에서 필요한 정보만 추출
    const { lat, lng, address } = location;
    console.log(lat, lng, address);
    // 필요한 정보만 저장
    handleFieldChange(index, "place", `${address}, ${lat}, ${lng}`);
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
  }

  // - 버튼 클릭 시 필드 삭제
  function handleDeleteField(index) {
    setFields(fields.filter((_, i) => i !== index));
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
        console.log(message);
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
    <div className={"plan"}>
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

        <h1>일정 등록하기</h1>

        <form className={"plan-container"}>
          <fieldset className={"plan-header"}>
            <ul className={"title"}>
              <li>
                <label htmlFor="title">여행명</label>
                <input
                  type="text"
                  id="name"
                  size="50"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </li>

              <li>
                <label htmlFor="description">설명</label>
                <input
                  type="text"
                  id="description"
                  size="100"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </li>

              <li>
                <label htmlFor="destination">여행지</label>
                <input
                  type="text"
                  id="destination"
                  size="20"
                  placeholder="어디로 떠나시나요?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </li>

              <ul className={"period"}>
                <li>
                  <label htmlFor="startDate">시작일</label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </li>
                <li>
                  <label htmlFor="endDate">종료일</label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </li>
              </ul>
            </ul>
          </fieldset>

          <fieldset className={"plan-body"}>
            {fields.map((field, index) => (
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
                  type="text"
                  name="schedule"
                  value={field.schedule}
                  onChange={(e) =>
                    handleFieldChange(index, "schedule", e.target.value)
                  }
                />

                <label htmlFor="place">장소</label>
                <GoogleMaps
                  id="place"
                  onPlaceSelected={(location) =>
                    handlePlaceSelected(index, location)
                  }
                  // value={field.place}
                  // onChange={(e) =>
                  //   handleFieldChange(index, "place", e.target.value)
                  // }
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

export default PlanAdd;
