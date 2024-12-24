import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Breadcrumb } from "../../../components/root/Breadcrumb.jsx";
import { Modal } from "../../../components/root/Modal.jsx";
import axios from "axios";
import { AuthenticationContext } from "../../../components/context/AuthenticationProvider.jsx";
import { Center, HStack } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../../components/ui/pagination.jsx";
import { IoIosRefresh } from "react-icons/io";

function FaqList(props) {
  const [faqList, setFaqList] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState();
  const [count, setCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState({
    type: searchParams.get("type") ?? "all",
    keyword: searchParams.get("key") ?? "",
  });

  const navigate = useNavigate();
  const { isAdmin, hasAccess } = useContext(AuthenticationContext);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get("/api/cs/faq/list", {
        params: searchParams,
        signal: controller.signal,
      })
      .then((res) => {
        setFaqList(res.data.faqList);
        setCount(res.data.count);
      })
      .catch((err) => {
        console.error("오류", err);
        setFaqList([]);
      });
    return () => {
      controller.abort();
    };
  }, [searchParams]);

  // console.log("searchParams", searchParams.toString());
  // console.log("검색 조건", search);

  // 날짜 포맷을 yyyy-MM-dd 형식으로 변환
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  function handleSearch() {
    if (search.keyword.trim().length > 0) {
      const nextSearchParam = new URLSearchParams(searchParams);
      nextSearchParam.set("type", search.type);
      nextSearchParam.set("key", search.keyword);
      setSearchParams(nextSearchParam);
    } else {
      const nextSearchParam = new URLSearchParams(searchParams);
      nextSearchParam.delete("type");
      nextSearchParam.delete("key");
      setSearchParams(nextSearchParam);
    }
  }

  function handlePageChange(e) {
    const pageNumber = { page: e.page };
    const pageQuery = new URLSearchParams(pageNumber);
    navigate(`/cs/faq/list?${pageQuery.toString()}`);
  }

  return (
    <div className={"faq"}>
      <Breadcrumb
        depth1={"고객센터"}
        navigateToDepth1={() => navigate(`/cs/index`)}
        depth2={"자주 묻는 질문"}
        navigateToDepth2={() => navigate(`/cs/faq/list`)}
      />

      <div className={"body-normal"}>
        <h1>자주 묻는 질문</h1>
        <h2>1대 1 문의 사항은 문의 게시판을 이용해주세요.</h2>

        <div className={"btn-wrap"}>
          <button
            className={"btn btn-dark-outline"}
            onClick={() => navigate("/cs/index")}
          >
            고객센터 홈
          </button>

          {isAdmin && hasAccess && (
            <button
              className={"btn btn-dark"}
              onClick={() => setAddModalOpen(true)}
            >
              작성
            </button>
          )}
        </div>

        {!faqList || faqList.length === 0 ? (
          <div className={"empty-container"}>
            <p className={"empty-container-title"}>등록된 FAQ가 없습니다.</p>
          </div>
        ) : (
          <table className={"table-list"}>
            <thead>
              <tr>
                <th>#</th>
                <th>질문</th>
                <th>작성일</th>
              </tr>
            </thead>

            <tbody>
              {faqList.map((faq) => (
                <tr
                  key={faq.id}
                  onClick={() => navigate(`/cs/faq/view/${faq.id}`)}
                >
                  <td>{faq.id}</td>
                  <td>{faq.question}</td>
                  <td>{formatDate(faq.updated)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className={"search-form"}>
          <button
            onClick={() => {
              // 1. 검색 상태 초기화
              setSearch({ type: "all", keyword: "" });

              // 2. URL 검색 파라미터 초기화
              const nextSearchParam = new URLSearchParams();
              nextSearchParam.set("type", "all");
              nextSearchParam.set("key", "");

              setSearchParams(nextSearchParam);
            }}
            style={{ marginRight: "10px", cursor: "pointer" }}
          >
            <IoIosRefresh />
          </button>

          <select
            defaultValue={search.type}
            onChange={(e) => setSearch({ ...search, type: e.target.value })}
          >
            <option value="all">전체</option>
            <option value="question">질문</option>
            <option value="answer">답변</option>
          </select>

          <div className={"search-form-input"}>
            <input
              type="search"
              value={search.keyword}
              onChange={(e) =>
                setSearch({ ...search, keyword: e.target.value.trim() })
              }
            />

            <button className={"btn-search btn-dark"} onClick={handleSearch}>
              검색
            </button>
          </div>
        </div>
      </div>

      <div className={"pagination"}>
        <Center>
          <PaginationRoot
            count={count}
            pageSize={10}
            defaultPage={1}
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

      {/* 추가 modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={() => navigate(`/cs/faq/add`)}
        message="FAQ를 작성하시겠습니까?"
        buttonMessage="작성"
      />
    </div>
  );
}

export default FaqList;
