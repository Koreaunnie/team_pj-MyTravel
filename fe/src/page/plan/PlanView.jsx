import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";

function PlanView(props) {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    axios.get(`api/plan/view/${id}`).then((res) => setPlan(res.data));
  }, []);

  if (plan === null) {
    return <Spinner />;
  }

  return (
    <div>
      <h1>{plan.title}</h1>
    </div>
  );
}

export default PlanView;
