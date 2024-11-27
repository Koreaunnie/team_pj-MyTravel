import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PlanView(props) {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    axios.get(`api/plan/view/${id}`).then((res) => setPlan(res.data));
  }, []);

  return (
    <div>
      <h1>일정 보기</h1>
    </div>
  );
}

export default PlanView;
