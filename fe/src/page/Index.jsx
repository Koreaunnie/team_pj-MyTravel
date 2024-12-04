import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Index.css";

export function Index() {
  const [planList, setPlanList] = useState([]); // Plan 리스트 상태
  const [tourList, setTourList] = useState([]); // Tour 리스트 상태
  const navigate = useNavigate();

  useEffect(() => {
    // API 호출
    axios
      .get("/api/index")
      .then((res) => {
        // API 결과를 각각의 상태로 설정
        setPlanList(res.data.plans);
        setTourList(res.data.tours);
      })
      .catch((error) => {
        console.error("Error fetching index data:", error);
      });
  }, []);

  const isEmpty = (list) => {
    return list.length === 0;
  };

  return (
    <div className={"body"}>
      {/* 검색 영역 */}
      <div className={"search-form-input section-search"}>
        <input type="text" placeholder={"어디로 떠나고 싶은가요?"} />
        <button className={"btn-search btn-dark"}>검색</button>
      </div>

      {/* 내 여행 섹션 */}
      <section>
        <div className={"section-header"}>
          <h2>내 여행</h2>
          <button className={"more-btn"} onClick={() => navigate(`/plan/list`)}>
            더보기
          </button>
        </div>

        <div className={"section-body"}>
          {isEmpty(planList) ? (
            <div className={"empty-container"}>
              <p className={"empty-container-title"}>여행 계획이 없습니다.</p>
              <p className={"empty-container-description"}>
                새로운 계획을 추가해보세요!
              </p>
            </div>
          ) : (
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
          )}
        </div>
      </section>

      {/* 투어 섹션 */}
      <section>
        <div className={"section-header"}>
          <h2>투어 목록</h2>
          <button className={"more-btn"} onClick={() => navigate(`/tour/list`)}>
            더보기
          </button>
        </div>

        <div className={"section-body"}>
          {isEmpty(planList) ? (
            <div className={"empty-container"}>
              <p className={"empty-container-title"}>투어가 없습니다.</p>
              <p className={"empty-container-description"}>
                새로운 투어를 추가해보세요!
              </p>
            </div>
          ) : (
            <ul className={"section-body-list"}>
              {tourList.map((tour) => (
                <li
                  key={tour.id}
                  onClick={() => navigate(`/tour/view/${tour.id}`)}
                >
                  <h3>{tour.product}</h3>
                  <ul className={"list-item"}>
                    <li className={"description"}>{tour.title}</li>
                    <li className={"location"}>{tour.location}</li>
                    <li className={"price"}>{tour.price}</li>
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 커뮤니티 섹션 */}
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
