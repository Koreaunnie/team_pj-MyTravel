import React, { useEffect, useState } from "react";
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
      <div className={"search-form-input section-search"}>
        <input type="text" placeholder={"어디로 떠나고 싶은가요?"} />
        <button className={"btn-search btn-dark"}>검색</button>
      </div>

      <section>
        <div className={"section-header"}>
          <h2>내 여행</h2>
          <button className={"more-btn"} onClick={() => navigate(`/plan/list`)}>
            더보기
          </button>
        </div>

        <div className={"section-body"}>
          <ul className={"section-body-list"}>
            {planList.map((plan) => (
              <li
                key={plan.id}
                onClick={() => navigate(`/plan/view/${plan.id}`)}
              >
                <h3>{plan.title}</h3>

                <ul className={"list-item"}>
                  <li className={"description"}>{plan.description}</li>
                  <li className={"destination"}>{plan.destination}</li>
                  <li className={"period"}>
                    {plan.startDate} ~ {plan.endDate}
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className={"section-header"}>
          <h2>투어 목록</h2>
          <button className={"more-btn"} onClick={() => navigate(`/tour/list`)}>
            더보기
          </button>
        </div>

        <div className={"section-body"}>
          <ul className={"section-body-list"}>
            {planList.map((plan) => (
              <li
                key={plan.id}
                onClick={() => navigate(`/plan/view/${plan.id}`)}
              >
                <h3>{plan.title}</h3>

                <ul className={"list-item"}>
                  <li className={"description"}>{plan.description}</li>
                  <li className={"destination"}>{plan.destination}</li>
                  <li className={"period"}>
                    {plan.startDate} ~ {plan.endDate}
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className={"section-header"}>
          <h2>커뮤니티</h2>
          <button
            className={"more-btn"}
            onClick={() => navigate(`/community/list`)}
          >
            더보기
          </button>
        </div>

        <div className={"section-body"}>
          <ul className={"section-body-list"}>
            {planList.map((plan) => (
              <li
                key={plan.id}
                onClick={() => navigate(`/plan/view/${plan.id}`)}
              >
                <h3>{plan.title}</h3>

                <ul className={"list-item"}>
                  <li className={"description"}>{plan.description}</li>
                  <li className={"destination"}>{plan.destination}</li>
                  <li className={"period"}>
                    {plan.startDate} ~ {plan.endDate}
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
