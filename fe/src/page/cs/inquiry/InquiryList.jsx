import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb } from "../../../components/root/Breadcrumb.jsx";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Modal } from "../../../components/root/Modal.jsx";
import { AuthenticationContext } from "../../../components/context/AuthenticationProvider.jsx";
import { CiLock } from "react-icons/ci";
import { toaster } from "../../../components/ui/toaster.jsx";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../../components/ui/pagination.jsx";
import { Center, HStack } from "@chakra-ui/react";
import { formattedDate } from "../../../components/utils/FormattedDate.jsx";
import { IoIosRefresh } from "react-icons/io";

function InquiryList(props) {
  const { nickname, isAuthenticated, isAdmin } = useContext(
    AuthenticationContext,
  );
  const [inquiryList, setInquiryList] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [showMyInquiries, setShowMyInquiries] = useState(false); // 내가 쓴 글 여부
  const [notAnsweredInquiries, setNotAnsweredInquiries] = useState(0);
  const [showNotAnswered, setShowNotAnswered] = useState(false);
  const [search, setSearch] = useState({ type: "all", keyword: "" });
  const [count, setCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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
        setCount(data.count);

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

  // 로그인 안 했을 때 작성 버튼 클릭하면 로그인 유도
  const checkLoginOrNot = () => {
    if (isAuthenticated) {
      setAddModalOpen(true);
    } else {
      toaster.create({
        type: "error",
        description: "로그인 후 문의글 작성이 가능합니다.",
      });
    }
  };

  // 내가 쓴 글만 필터링
  const filteredInquiries = showMyInquiries
    ? inquiryList.filter((inquiry) => inquiry.writerNickname === nickname)
    : inquiryList;

  // 미답변 내역만 필터링
  const inquiriesToShow = showNotAnswered
    ? filteredInquiries.filter((inquiry) => !inquiry.hasAnswer)
    : filteredInquiries;

  // 비밀글 여부 확인
  const checkSecretOrNot = (inquiry) => {
    if (inquiry.secret) {
      if (!isAuthenticated) {
        toaster.create({
          type: "error",
          description: "로그인 후 확인할 수 있습니다.",
        });
        return;
      }

      if (!isAdmin && inquiry.writerNickname !== nickname) {
        toaster.create({
          type: "warning",
          description: "비공개 문의내역은 작성자 본인만 확인할 수 있습니다.",
        });
        return;
      }
    }

    // 비밀글이 아니거나 권한 확인 통과 시 상세 페이지로 이동
    navigate(`/cs/inquiry/view/${inquiry.id}`);
  };

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

  // 엔터 키로 검색 실행
  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleSearchButton();
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

  return (
    <div className={"inquiry"}>
      <Breadcrumb
        depth1={"고객센터"}
        navigateToDepth1={() => navigate(`/cs/index`)}
        depth2={"문의 게시판"}
        navigateToDepth2={() => navigate(`/cs/inquiry/list`)}
      />

      <div className={"body-normal"}>
        <h1>문의하기</h1>
        <h2>궁금한 점이 있으시면 문의해주세요.</h2>
        <h3>운영 시간 09:00 ~ 18:00</h3>

        <div className={"btn-wrap"}>
          <button
            className={"btn btn-dark-outline"}
            onClick={() => navigate("/cs/index")}
          >
            고객센터 홈
          </button>

          <div>
            {!isAdmin && (
              <button className={"btn btn-blue"} onClick={checkLoginOrNot}>
                작성
              </button>
            )}

            {isAdmin && (
              <button
                className={"btn btn-blue"}
                onClick={() => setShowNotAnswered((prev) => !prev)}
              >
                {!showNotAnswered
                  ? `미답변 내역 : ${notAnsweredInquiries}`
                  : "전체내역"}
              </button>
            )}

            {isAuthenticated && !isAdmin && (
              <button
                className={"btn btn-dark"}
                onClick={() => setShowMyInquiries((prev) => !prev)}
              >
                {showMyInquiries ? "전체글" : "내가 쓴 글"}
              </button>
            )}
          </div>
        </div>

        <table className={"table-list"}>
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
            {inquiriesToShow.length > 0 ? (
              inquiriesToShow.map((inquiry) => (
                <tr key={inquiry.id} onClick={() => checkSecretOrNot(inquiry)}>
                  <td>{inquiry.id}</td>
                  {inquiry.secret ? (
                    <td className={"title-center secret"}>
                      <span className={"icon"}>
                        <CiLock />
                      </span>
                      비밀글입니다.
                    </td>
                  ) : (
                    <td className={"title-center"}>{inquiry.title}</td>
                  )}
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
              onKeyPress={handleKeyPress}
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
          <Center>
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
          </Center>
        </div>
      </div>

      {/* 추가 modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={() => navigate(`/cs/inquiry/add`)}
        message="문의 글을 작성하시겠습니까?"
        buttonMessage="작성"
      />
    </div>
  );
}

export default InquiryList;
