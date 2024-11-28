import { useEffect, useState } from "react";
import axios from "axios";

export function Index() {
  const [planList, setPlanList] = useState([]);

  useEffect(() => {
    axios
      .get("/api/index")
      .then((res) => setPlanList(res.data))
      .catch()
      .finally();
  }, []);

  return (
    <div className={"body"}>
      <section>
        <h3>내 여행</h3>

        <ul>
          {planList.map((plan) => (
            <li key={plan.id}>
              <h5>{plan.title}</h5>
              <p>{plan.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
