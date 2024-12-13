import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Index.css";
import { IoSearch } from "react-icons/io5";

export function Index() {
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [planList, setPlanList] = useState([]);
  const [tourList, setTourList] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/index", {
        params: searchParams,
      })
      .then((res) => {
        console.log("Response data:", res.data);
        setPlanList(res.data.plans);
        setTourList(res.data.tours);
        setCommunityList(res.data.community);
      })
      .catch((error) => {
        console.error("Error fetching index data:", error);
      });
  }, [searchParams]);

  useEffect(() => {
    const keyword = searchParams.get("keyword") || "";
    setSearch(keyword);
  }, [searchParams]);

  function handleSearchButton() {
    const nextSearchParam = new URLSearchParams(searchParams);

    if (search.trim().length > 0) {
      // 검색
      nextSearchParam.set("keyword", search.trim());
    } else {
      // 검색 안 함
      nextSearchParam.delete("keyword");
    }
    setSearchParams(nextSearchParam);
  }

  // 엔터 키로 검색 실행
  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleSearchButton();
    }
  }

  const isEmpty = (list) => list.length === 0;

  return (
    <div className={"body-wide"}>
      {/* 검색 영역 */}
      <section className={"main-search-wrap"}>
        <input
          type="search"
          placeholder={"어디로 떠나고 싶은가요?"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className={"main-search-wrap-btn"} onClick={handleSearchButton}>
          <IoSearch />
        </button>
      </section>

      {/* 내 여행 섹션 */}
      <section className={"main-section-wrap"}>
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
            <ul className={"section-body-card"}>
              {planList.map((plan) => (
                <li
                  key={plan.id}
                  onClick={() => navigate(`/plan/view/${plan.id}`)}
                >
                  <h3>{plan.title}</h3>
                  <ul className={"list-item"}>
                    <li className={"description"}>{plan.description}</li>
                    <li className={"location"}>{plan.destination}</li>
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
      <section className={"main-section-wrap"}>
        <div className={"section-header"}>
          <h2>투어 목록</h2>
          <button className={"more-btn"} onClick={() => navigate(`/tour/list`)}>
            더보기
          </button>
        </div>

        <div className={"section-body"}>
          {isEmpty(tourList) ? (
            <div className={"empty-container"}>
              <p className={"empty-container-title"}>투어가 없습니다.</p>
              <p className={"empty-container-description"}>
                새로운 투어를 추가해보세요!
              </p>
            </div>
          ) : (
            <ul className={"section-body-card"}>
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

      <div>광고 슬라이드 (마이리얼트립 st)</div>

      {/* 커뮤니티 섹션 */}
      <section className={"notice-section-wrap"}>
        <div className={"notice-section-header"}>
          <h2>커뮤니티</h2>
          <button className={"more-btn"} onClick={() => navigate(`/plan/list`)}>
            더보기
          </button>
        </div>

        <div className={"notice-section-body"}>
          {isEmpty(communityList) ? (
            <div className={"empty-container"}>
              <p className={"empty-container-title"}>작성된 글이 없습니다.</p>
              <p className={"empty-container-description"}>
                로그인 후 커뮤니티에서 다양한 이야기를 들려주세요!
              </p>
            </div>
          ) : (
            communityList.map((community) => (
              <ul
                className={"notice-section-list"}
                key={community.id}
                onClick={() => navigate(`/community/view/${community.id}`)}
              >
                <li>{community.title}</li>
                <li>{community.writer}</li>
                <li>{community.inserted}</li>
              </ul>
            ))
          )}

          <div className={"link-box"}>
            커뮤니티에서 다양한 여행 이야기를 들려주세요! (서대문구 st)
          </div>
        </div>
      </section>
    </div>
  );
}
