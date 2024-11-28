import React, { useState } from "react";
import axios from "axios";
import "./Plan.css";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";

function PlanAdd(props) {
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState("");
  const [due, setDue] = useState("");
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
        due,
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
      })
      .finally(() => {
        // 요청 완료 후 처리
        setTitle("");
        setDescription("");
        setDestination("");
        setDue("");
        setFields([
          {
            date: "",
            time: "",
            schedule: "",
            place: "",
            memo: "",
          },
        ]);
      });
  }

  // 제목이 비어있으면 버튼 비활성화
  const disabled = () => {
    return title.trim().length === 0;
  };

  const closeModal = () => {
    setSaveModalOpen(false);
  };

  return (
    <div className={"body"}>
      <div className="btn-wrap">
        <button
          className="btn btn-dark-outline"
          onClick={() => navigate(`/plan/list`)}
        >
          목록
        </button>

        <button
          className="btn btn-dark"
          disabled={disabled()}
          onClick={setSaveModalOpen}
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
                size="20"
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
                size="50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </li>
          </ul>

          <ul className={"sub-title"}>
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

            <li>
              <label htmlFor="due">기간</label>
              <input
                type="text"
                id="due"
                size="20"
                value={due}
                onChange={(e) => setDue(e.target.value)}
              />
            </li>
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
                name="schedule"
                value={field.schedule}
                onChange={(e) =>
                  handleFieldChange(index, "schedule", e.target.value)
                }
              />

              <label htmlFor="location">장소</label>
              <input
                name="location"
                value={field.place}
                onChange={(e) =>
                  handleFieldChange(index, "place", e.target.value)
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

      {/* 저장 modal */}
      {saveModalOpen && (
        <div className={"modal"}>
          <div className={"modal-content"}>
            <div className={"modal-header"}>
              <a href="#" className={"close"} onClick={closeModal}>
                &times;
              </a>
            </div>

            <div className={"modal-body"}>
              <p>여행을 저장하시겠습니까?</p>
            </div>

            <div className={"modal-footer btn-wrap"}>
              <button className={"btn btn-dark-outline"} onClick={closeModal}>
                닫기
              </button>

              <button className={"btn btn-dark"} onClick={handleSaveButton}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanAdd;
