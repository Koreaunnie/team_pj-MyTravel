import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Index.css";
import { IoSearch } from "react-icons/io5";
import { FaArrowRight, FaPlus } from "react-icons/fa6";
import { IndexSlider } from "./IndexSlider.jsx";
import Calendar from "react-calendar";
import { formatNumberWithCommas } from "../components/utils/FormatNumberWithCommas.jsx";

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
        setPlanList(res.data.plans);
        setTourList(res.data.tours);
        setCommunityList(res.data.community);
        console.log(communityList);
        console.log(tourList);
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
    <div>
      {/* 검색 영역 */}
      <section className={"main-search-container"}>
        <div className={"main-search-wrap"}>
          <input
            type="search"
            placeholder={"어디로 떠나고 싶은가요?"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className={"main-search-wrap-btn"}
            onClick={handleSearchButton}
          >
            <IoSearch />
          </button>
        </div>
      </section>

      {/* 달력 */}
      <section className={"main-calendar-section-wrap"}>
        <div className={"section-left"}>
          <Calendar
            className={"calendar"}
            formatDay={(locale, date) =>
              date.toLocaleString("en", { day: "numeric" })
            }
            showNeighboringMonth={false}
            next2Label={null}
            prev2Label={null}
          />
        </div>

        <div className={"section-right"}>
          <div className={"index-calendar-btn-wrap"}>
            <button
              className={"index-calendar-btn"}
              onClick={() => navigate(`/plan/list`)}
            >
              내 여행 일정 보기
            </button>

            <button
              className={"index-calendar-btn"}
              onClick={() => navigate(`/wallet/list`)}
            >
              내 지갑 내역 보기
            </button>
          </div>

          <div>
            <ul>
              <li>2024년 12월 24일의 일정</li>
              <li>한강에서 라면먹기</li>
              <li>친구랑</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 내 여행 */}
      <section className={"plan-container"}>
        <div className={"plan-container-wrap"}>
          <div className={"plan-container-header"}>
            <h2>내 여행</h2>
            <button
              className={"more-btn"}
              onClick={() => navigate(`/plan/list`)}
            >
              여행 일정 관리하러 가기{" "}
              <FaArrowRight
                style={{
                  display: "inline",
                  marginLeft: "4px",
                  marginTop: "-3px",
                }}
              />
            </button>
          </div>

          <div className={"plan-container-body"}>
            {isEmpty(planList) ? (
              <div className={"empty-container"}>
                <p className={"empty-container-title"}>여행 계획이 없습니다.</p>
                <p className={"empty-container-description"}>
                  새로운 계획을 추가해보세요!
                </p>
              </div>
            ) : (
              <div className={"plan-container-card"}>
                {planList.map((plan) => (
                  <ul
                    key={plan.id}
                    onClick={() => navigate(`/plan/view/${plan.id}`)}
                  >
                    <li className={"title"}>{plan.title}</li>
                    <li>{plan.description}</li>
                    <li>{plan.destination}</li>
                    <li>
                      {plan.startDate} ~ {plan.endDate}
                    </li>
                  </ul>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 회원가입 유도 배너 */}
      <section className={"info-banner"}>
        <div className={"info-banner-wrap"}>
          <p>회원가입 없이도 투어 상품을 둘러보실 수 있습니다.</p>
          <button type={"button"} onClick={() => navigate("/member/login")}>
            회원가입 후 더 많은 혜택 누리기
          </button>
        </div>
      </section>

      {/* 투어 */}
      <section className={"tour-container"}>
        <div className={"tour-container-header"}>
          <h2>지금 당장 떠나보세요!</h2>
          <button className={"more-btn"} onClick={() => navigate(`/tour/list`)}>
            더보기
          </button>
        </div>

        <div className={"tour-container-body"}>
          {isEmpty(tourList) ? (
            <div className={"empty-container"}>
              <p className={"empty-container-title"}>투어가 없습니다.</p>
              <p className={"empty-container-description"}>
                새로운 투어를 추가해보세요!
              </p>
            </div>
          ) : (
            <div className={"tour-container-card"}>
              {tourList.map((tour) => (
                <ul
                  key={tour.id}
                  onClick={() => navigate(`/tour/view/${tour.id}`)}
                >
                  <li className={"image"}>
                    <img src={tour.src} alt={"투어 사진"} />
                  </li>
                  <div className={"li-wrap"}>
                    <li className={"title"}>{tour.product}</li>
                    <li>{tour.title}</li>
                    <li>{tour.location}</li>
                    <li>{formatNumberWithCommas(tour.price)}원</li>
                  </div>
                </ul>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 커뮤니티 */}
      <section className={"community-container"}>
        <div className={"community-container-wrap"}>
          <div className={"community-container-header"}>
            <h2>커뮤니티</h2>
            <button
              className={"more-btn"}
              onClick={() => navigate(`/plan/list`)}
            >
              더보기
            </button>
          </div>

          <div className={"community-container-body"}>
            {isEmpty(communityList) ? (
              <div className={"empty-container"}>
                <p className={"empty-container-title"}>작성된 글이 없습니다.</p>
                <p className={"empty-container-description"}>
                  여러분의 다양한 여행 이야기를 들려주세요!
                </p>
              </div>
            ) : (
              <div className={"community-container-list"}>
                {communityList.map((community) => (
                  <ul
                    className={"list-item"}
                    key={community.id}
                    onClick={() => navigate(`/community/view/${community.id}`)}
                  >
                    <li className={"description"}>{community.title}</li>
                    <li className={"location"}>{community.writer}</li>
                    <li className={"price"}>{community.inserted}</li>
                  </ul>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className={"ad"}>
        <IndexSlider />
      </section>

      {/* 고객센터 */}
      <div className={"divided-container"}>
        <div className={"divided-container-wrap"}>
          <section className={"tel-container"}>
            <h3>마이트래블 고객센터</h3>
            <h5>1588-1111</h5>

            <ul>
              <li>&#10023; 평일: 09:00 ~ 18:00</li>
              <li>&#10023; 주말 / 공휴일 휴무</li>
            </ul>
          </section>

          <section className={"notice-section-wrap"}>
            <div className={"notice-section-header"}>
              <h2>공지사항</h2>
              <button
                className={"more-btn"}
                onClick={() => navigate(`/community/list`)}
              >
                <FaPlus className={"pointer"} />
              </button>
            </div>

            <div className={"notice-section-body"}>
              {isEmpty(communityList) ? (
                <div className={"empty-container"}>
                  <p className={"empty-container-title"}>
                    공지사항이 없습니다.
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
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
