import React, { useContext, useEffect, useState } from "react";
import { Center, HStack } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";
import { IoIosRefresh } from "react-icons/io";
import { FaRegQuestionCircle } from "react-icons/fa";
import "./Tour.css";
import { formatNumberWithCommas } from "../../components/utils/FormatNumberWithCommas.jsx";
import { IoSearch } from "react-icons/io5";
import { Rating } from "../../components/ui/rating.jsx";

function TourList() {
  const [tourList, setTourList] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("box");
  const [count, setCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1,
  );
  const [search, setSearch] = useState({
    type: searchParams.get("type") ?? "all",
    keyword: searchParams.get("key") ?? "",
  });
  // console.log(currentPage);

  const { isPartner, isAdmin } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`/api/tour/list`, {
        params: searchParams,
        signal: controller.signal,
      })
      .then((res) => {
        setTourList(res.data.tourList);
        setCount(res.data.count);
      })
      .catch((err) => {
        setTourList([]);
      });
    return () => {
      controller.abort();
    };
  }, [searchParams]);

  // Update currentPage when URL changes
  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    setCurrentPage(page);
  }, [searchParams]);

  function handleRowClick(id) {
    navigate(`/tour/view/${id}`);
  }

  function handleSearchClick() {
    if (search.keyword.trim().length > 0) {
      const nextSearchParam = new URLSearchParams(searchParams);
      nextSearchParam.set("type", search.type);
      nextSearchParam.set("key", search.keyword);
      nextSearchParam.set("page", currentPage.toString());
      setSearchParams(nextSearchParam);
    } else {
      const nextSearchParam = new URLSearchParams(searchParams);
      nextSearchParam.delete("type");
      nextSearchParam.delete("key");
      nextSearchParam.delete("page", currentPage.toString());
      setSearchParams(nextSearchParam);
    }
  }

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  //pagination
  function handlePageChange(e) {
    const pageNumber = { page: e.page };
    const pageQuery = new URLSearchParams(pageNumber);
    const searchInfo = { type: search.type, key: search.keyword };
    const searchQuery = new URLSearchParams(searchInfo);
    navigate(`/tour/list?${searchQuery.toString()}&${pageQuery.toString()}`);
  }

  return (
    <div className={"tour"}>
      <Breadcrumb
        depth1={"투어"}
        navigateToDepth1={() => navigate(`/tour/list`)}
      />

      <div>
        <h1>투어 상품</h1>
        <h2>다양한 투어 상품을 구경해보세요.</h2>

        {/*검색*/}
        <div className={"tour-search-container"}>
          <div className={"tour-search-wrap"}>
            <select
              className={"tour-search-select"}
              value={search.type}
              onChange={(e) => setSearch({ ...search, type: e.target.value })}
            >
              <option value="all">전체</option>
              <option value="title">제목</option>
              <option value="product">제품</option>
              <option value="location">위치</option>
              <option value="content">본문</option>
              <option value="partner">파트너사</option>
            </select>

            <input
              className={"tour-search-input"}
              type={"search"}
              value={search.keyword}
              onChange={(e) =>
                setSearch({ ...search, keyword: e.target.value.trim() })
              }
            />

            <button
              style={{ cursor: "pointer" }}
              onClick={() => {
                // 1. 검색 상태 초기화
                setSearch({ type: "all", keyword: "" });

                // 2. URL 검색 파라미터 초기화
                const nextSearchParam = new URLSearchParams();
                nextSearchParam.set("type", "all");
                nextSearchParam.set("key", "");

                setSearchParams(nextSearchParam);
              }}
            >
              <IoIosRefresh />
            </button>

            <button className={"tour-search-btn"} onClick={handleSearchClick}>
              <IoSearch />
            </button>
          </div>
        </div>

        <div className={"body-wide"}>
          {/* 보기 선택 */}
          <div className={"tour-btn-wrap"}>
            {(isPartner || isAdmin) && (
              <button
                className={"btn btn-blue"}
                onClick={() => navigate(`/tour/add`)}
              >
                새 상품 등록
              </button>
            )}

            <button
              className={"btn btn-dark-outline"}
              onClick={() => handleMenuClick("box")}
            >
              박스형
            </button>
            <button
              className={"btn btn-dark-outline"}
              onClick={() => handleMenuClick("list")}
            >
              목록형
            </button>
          </div>

          {selectedMenu === "box" && (
            <div>
              {tourList.length === 0 ? (
                <div className={"empty-container"}>
                  <p>
                    <FaRegQuestionCircle
                      className={"empty-container-icon"}
                      style={{ color: "#a1a1a8" }}
                    />
                  </p>
                  <p className={"empty-container-title"}>
                    찾으시는 상품이 존재하지 않습니다.
                  </p>
                  <p className={"empty-container-description"}>
                    다른 여행은 어떠세요?
                  </p>
                </div>
              ) : (
                <div className={"tour-box-container"}>
                  {tourList.map((tour) => (
                    <ul
                      className={"tour-box"}
                      key={tour.id}
                      onClick={() => navigate(`/tour/view/${tour.id}`)}
                    >
                      <li className={"image"}>
                        <img src={tour.src} alt={"투어 사진"} />
                      </li>

                      <div className={"li-wrap"}>
                        <li className={"title"}>{tour.title}</li>
                        <li>{tour.product}</li>
                        <li>{tour.location}</li>
                        <li>{formatNumberWithCommas(tour.price)}원</li>
                        <li className={"tour-list-review"}>
                          <Rating readOnly value={tour.rateAvg} />
                          <span className={"review-count"}>
                            (리뷰 {tour.reviewCnt}개)
                          </span>
                        </li>
                      </div>
                    </ul>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedMenu === "list" && (
            <div className={"tour-list-container"}>
              {tourList.length === 0 ? (
                <div className={"empty-container"}>
                  <p>
                    <FaRegQuestionCircle
                      className={"empty-container-icon"}
                      style={{ color: "#a1a1a8" }}
                    />
                  </p>
                  <p className={"empty-container-title"}>
                    찾으시는 상품이 존재하지 않습니다.
                  </p>
                  <p className={"empty-container-description"}>
                    다른 여행은 어떠세요?
                  </p>
                </div>
              ) : (
                <div>
                  {tourList.map((tour) => (
                    <ul
                      className={"tour-list"}
                      key={tour.id}
                      onClick={() => handleRowClick(tour.id)}
                    >
                      <li className={"tour-list-title"}>{tour.title}</li>
                      <li className={"tour-list-description"}>
                        {tour.product}
                      </li>
                      <li className={"tour-list-location"}>{tour.location}</li>
                      <li className={"tour-list-review"}>★★★★★ (리뷰 00개)</li>
                      <li className={"tour-list-price"}>
                        {formatNumberWithCommas(tour.price)} 원
                      </li>
                      <li className={"tour-list-img"}>
                        <img key={tour.image} src={tour.src} />
                      </li>
                    </ul>
                  ))}
                </div>
              )}
            </div>
          )}

          {/*pagination*/}
          <div className={"pagination"}>
            <Center>
              <PaginationRoot
                count={count}
                pageSize={10}
                defaultPage={currentPage}
                onPageChange={handlePageChange}
                variant="solid"
              >
                <HStack>
                  <PaginationPrevTrigger />
                  <PaginationItems />
                  <PaginationNextTrigger />
                </HStack>
              </PaginationRoot>
            </Center>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TourList;
