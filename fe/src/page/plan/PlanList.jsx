import React, { useEffect, useState } from "react";
import { Badge, Box, Card, HStack } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";

function PlanList(props) {
  const [planList, setPlanList] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [search, setSearch] = useState({ type: "all", keyword: "" }); // 검색 정보 유지
  const [count, setCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/plan/list", {
        params: searchParams,
      })
      .then((res) => res.data)
      .then((data) => {
        setPlanList(data.list);
        setCount(data.count);
      });
  }, [searchParams]);

  useEffect(() => {
    const nextSearch = { ...search };

    if (searchParams.get("st")) {
      nextSearch.type = searchParams.get("st");
    } else {
      nextSearch.type = "all";
    }

    if (searchParams.get("sk")) {
      nextSearch.keyword = searchParams.get("sk");
    } else {
      nextSearch.keyword = "";
    }

    setSearch(nextSearch);
  }, [searchParams]);

  // search
  function handleSearchButton(e) {
    const nextSearchParam = new URLSearchParams(searchParams);

    if (search.keyword.trim().length > 0) {
      // 검색 (검색 파라미터 추가)
      const nextSearchParam = new URLSearchParams(searchParams);
      nextSearchParam.set("st", search.type);
      nextSearchParam.set("sk", search.keyword);
      setSearchParams(nextSearchParam);
    } else {
      // 검색 안함 (검색 파라미터 삭제)
      const nextSearchParam = new URLSearchParams(searchParams);
      nextSearchParam.delete("st");
      nextSearchParam.delete("sk");
      setSearchParams(nextSearchParam);
    }
  }

  // pagination
  // page 번호 (searchParams : URL 쿼리 파라미터 관리)
  const pageParam = searchParams.get("page") ?? "1";
  // 문자열로 가져온 page 값을 숫자 타입으로 변환
  const page = Number(pageParam);

  // 페이지 번호 변경 시 URL 의 쿼리 파라미터를 업데이트
  function handlePageChange(e) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", e.page);
    setSearchParams(nextSearchParams);
  }

  // modal
  const closeModal = () => {
    setAddModalOpen(false);
  };

  return (
    <div className="body">
      <button className="btn btn-dark" onClick={() => setAddModalOpen(true)}>
        새로운 여행 작성하기
      </button>

      <div className={"search-form"}>
        <select
          onChange={(e) => setSearch({ ...search, type: e.target.value })}
        >
          <option value="all">전체</option>
          <option value="title">여행명</option>
          <option value="destination">여행지</option>
        </select>
        <input
          type="search"
          placeholder={"내 여행을 검색해보세요."}
          value={search.keyword}
          onChange={(e) =>
            setSearch({ ...search, keyword: e.target.value.trim() })
          }
        />
        <button className={"btn btn-dark"} onClick={handleSearchButton}>
          검색
        </button>
      </div>

      {planList.map((plan) => (
        <div key={plan.id}>
          <Card.Root flexDirection="row" overflow="hidden" maxW="xl" my={5}>
            <Box>
              <Card.Body>
                <Card.Title mb="5">{plan.title}</Card.Title>
                <Card.Description>{plan.description}</Card.Description>
                <HStack mt="5">
                  <Badge>{plan.destination}</Badge>
                  <Badge>{plan.due}</Badge>
                </HStack>
              </Card.Body>

              <Card.Footer>
                <button
                  className="btn btn-dark"
                  onClick={() => {
                    navigate(`/plan/view/${plan.id}`);
                  }}
                >
                  여행 보기
                </button>
              </Card.Footer>
            </Box>
          </Card.Root>
        </div>
      ))}

      {/* pagination */}
      <div className="pagination">
        <PaginationRoot
          onPageChange={handlePageChange}
          count={count}
          pageSize={10}
          page={page}
          variant="solid"
        >
          <HStack>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      </div>

      {/* 새 여행 modal */}
      {addModalOpen && (
        <div className={"modal"}>
          <div className={"modal-content"}>
            <div className={"modal-header"}>
              <a href="#" className={"close"} onClick={closeModal}>
                &times;
              </a>
            </div>

            <div className={"modal-body"}>
              <p>새로운 여행을 작성하시겠습니까?</p>
            </div>

            <div className={"modal-footer btn-wrap"}>
              <button className={"btn btn-dark-outline"} onClick={closeModal}>
                닫기
              </button>

              <button
                className={"btn btn-dark"}
                onClick={() => navigate(`/plan/add`)}
              >
                작성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanList;
