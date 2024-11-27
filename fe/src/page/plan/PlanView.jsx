import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";

function PlanView(props) {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [planFields, setPlanFields] = useState([]);
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

  return (
    <div className={"body"}>
      <button className={"btn"} onClick={() => navigate(`/plan/list`)}>
        목록
      </button>
      <button className={"btn"} onClick={() => navigate(`/plan/add`)}>
        새 일정 작성
      </button>
      <button className={"btn"} onClick={() => navigate(`/plan/edit/${id}`)}>
        수정
      </button>

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
    </div>
  );
}

export default PlanView;
