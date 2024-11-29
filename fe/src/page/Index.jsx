import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Index.css";

export function Index() {
  const [planList, setPlanList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/index")
      .then((res) => setPlanList(res.data))
      .catch()
      .finally();
  }, []);

  return (
    <div className={"body"}>
      <div className={"section-wrap"}>
        <section>
          <div className={"section-header"}>
            <h3>내 여행</h3>
            <button onClick={() => navigate(`/plan/list`)}>+</button>
          </div>

          <div className={"section-body"}>
            <ul>
              {planList.map((plan) => (
                <li key={plan.id}>
                  <h5>{plan.title}</h5>
                  <p>{plan.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h3>투어 상품</h3>

          <ul>
            <li>
              <h5></h5>
              <p></p>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
