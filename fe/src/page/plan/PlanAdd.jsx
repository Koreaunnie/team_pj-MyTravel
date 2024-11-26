import React, { useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import "./PlanAdd.css";

function PlanAdd(props) {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [due, setDue] = useState("");

  // 상태 정의: 추가할 div들을 관리
  const [fields, setFields] = useState([
    {
      date: "",
      schedule: "",
      place: "",
      time: "",
      memo: "",
    },
  ]);

  // div 입력값을 상태로 업데이트하는 함수
  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...fields];
    updatedFields[index][field] = value;
    setFields(updatedFields);
  };

  // + 버튼 클릭 시 새로운 필드 추가
  const handleAddField = () => {
    setFields([
      ...fields,
      {
        date: "",
        schedule: "",
        place: "",
        time: "",
        memo: "",
      },
    ]);
  };

  // - 버튼 클릭 시 필드 삭제
  const handleDeleteField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  // 폼 제출 처리 함수
  const handleSaveClick = () => {
    axios
      .post("/api/plan/add", {
        title,
        destination,
        due,
        fields, // 필드 배열(+버튼으로 추가한 항목)을 그대로 전달
      })
      .then(() => alert("일정이 저장되었습니다."))
      .catch()
      .finally(() => {
        // 요청 완료 후 처리
        setTitle("");
        setDestination("");
        setDue("");
        setFields([
          {
            date: "",
            schedule: "",
            place: "",
            time: "",
            memo: "",
          },
        ]);
      });
  };

  return (
    <div className={"body"}>
      <h1>일정 등록하기</h1>

      <form className={"plan-container"}>
        <fieldset>
          <label htmlFor="title">여행명</label>
          <input
            type="text"
            id="name"
            size="50"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

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
                id="due"
                value={due}
                onChange={(e) => setDue(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>

        <fieldset>
          {fields.map((field, index) => (
            <div key={index}>
              <label htmlFor="date">날짜</label>
              <input
                name="date"
                type="date"
                value={field.date}
                onChange={(e) =>
                  handleFieldChange(index, "date", e.target.value)
                } // 상태 업데이트
              />

              <label htmlFor="schedule">일정명</label>
              <input
                name="schedule"
                value={field.schedule}
                onChange={(e) =>
                  handleFieldChange(index, "schedule", e.target.value)
                } // 상태 업데이트
              />

              <label htmlFor="location">장소</label>
              <input
                name="location"
                value={field.place}
                onChange={(e) =>
                  handleFieldChange(index, "place", e.target.value)
                } // 상태 업데이트
              />

              <label htmlFor="time">시간</label>
              <input
                name="time"
                value={field.time}
                onChange={(e) =>
                  handleFieldChange(index, "time", e.target.value)
                } // 상태 업데이트
              />

              <label htmlFor="memo">메모</label>
              <textarea
                name="memo"
                value={field.memo}
                onChange={(e) =>
                  handleFieldChange(index, "memo", e.target.value)
                } // 상태 업데이트
              />

              <div className={"btn-wrap"}>
                <Button type="button" onClick={handleAddField}>
                  +
                </Button>
                <Button type="button" onClick={() => handleDeleteField(index)}>
                  -
                </Button>
              </div>
            </div>
          ))}
        </fieldset>

        <div className={"btn-wrap"}>
          <Button alignSelf="flex-start" onClick={handleSaveClick}>
            저장
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PlanAdd;
