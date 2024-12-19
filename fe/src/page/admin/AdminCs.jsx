import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { formattedDate } from "../../components/utils/FormattedDate.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";
import { HStack } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";

function AdminCs(props) {
  const { isAdmin } = useContext(AuthenticationContext);
  const [inquiryList, setInquiryList] = useState([]);
  const [notAnsweredInquiries, setNotAnsweredInquiries] = useState(0);
  const [showNotAnswered, setShowNotAnswered] = useState(false);
  const [countInquiry, setCountInquiry] = useState(0);
  const [search, setSearch] = useState({ type: "all", keyword: "" });
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    axios
      .get("/api/cs/inquiry/list", {
        params: {
          st: search.type,
          sk: search.keyword,
          page: pageParam,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        setInquiryList(data.list);
        setCountInquiry(data.count);

        // 미답변 내역 개수 업데이트
        const notAnsweredCount = data.list.filter(
          (inquiry) => !inquiry.hasAnswer,
        ).length;
        setNotAnsweredInquiries(notAnsweredCount);
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

  // 미답변 내역 필터링
  const inquiriesToShow = showNotAnswered
    ? inquiryList.filter((inquiry) => !inquiry.hasAnswer)
    : inquiryList;

  const handleSearchButton = () => {
    const nextSearchParam = new URLSearchParams(searchParams);

    if (search.keyword.trim().length > 0) {
      nextSearchParam.set("st", search.type);
      nextSearchParam.set("sk", search.keyword);
    } else {
      nextSearchParam.delete("st");
      nextSearchParam.delete("sk");
    }

    setSearchParams(nextSearchParam);
  };

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

  return (
    <div className={"admin-cs"}>
      <div>
        <h1>문의 내역 관리</h1>

        <div className={"admin-inquiry-header"}>
          <h2>미답변 내역 : {notAnsweredInquiries} 건</h2>
          <button
            className={"btn btn-dark"}
            onClick={() => setShowNotAnswered((prev) => !prev)}
          >
            {!showNotAnswered ? "미답변 내역만 보기" : "전체내역"}
          </button>
        </div>

        <table className={"table-list"}>
          <colgroup>
            <col style={{ width: "50px" }} />
            <col style={{ width: "250px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "80px" }} />
            <col style={{ width: "100px" }} />
          </colgroup>

          <thead>
            <tr>
              <th>#</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>답변 상태</th>
            </tr>
          </thead>

          <tbody>
            {inquiriesToShow && inquiriesToShow.length > 0 ? (
              inquiriesToShow.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td>{inquiry.id}</td>
                  <td className={"title-center"}>{inquiry.title}</td>
                  <td>{inquiry.writerNickname}</td>
                  <td>{formattedDate(inquiry.updated)}</td>
                  <td>
                    {inquiry.hasAnswer ? (
                      <span className="badge badge-success">답변 완료</span>
                    ) : isAdmin ? (
                      <button className="badge badge-dark">
                        답변 작성하기
                      </button>
                    ) : (
                      <span className="badge badge-warning">답변 대기중</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  문의 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 검색 */}
        <div className={"search-form"}>
          <select
            onChange={(e) => setSearch({ ...search, type: e.target.value })}
          >
            <option value="all">전체</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="writer">작성자</option>
          </select>

          <div className={"search-form-input"}>
            <input
              type="search"
              value={search.keyword}
              onChange={(e) =>
                setSearch({ ...search, keyword: e.target.value.trim() })
              }
            />
            <button
              className={"btn-search btn-dark"}
              onClick={handleSearchButton}
            >
              검색
            </button>
          </div>
        </div>

        {/* pagination */}
        <div className="pagination">
          <PaginationRoot
            onPageChange={handlePageChange}
            count={countInquiry}
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
      </div>

      {/*<div>*/}
      {/*  <h1>faq 관리</h1>*/}
      {/*</div>*/}
    </div>
  );
}

export default AdminCs;
