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
import { HStack } from "@chakra-ui/react";

function InquiryList(props) {
  const { nickname, isAuthenticated, isAdmin } = useContext(
    AuthenticationContext,
  );
  const [inquiryList, setInquiryList] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [showMyInquiries, setShowMyInquiries] = useState(false); // 내가 쓴 글 여부
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

  // 엔터 키로 검색 실행
  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleSearchButton();
    }
  }

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

  // 날짜 포맷팅
  const formattedDate = (props) => {
    const date = new Date(props);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 해줘야 함
    const day = String(date.getDate()).padStart(2, "0"); // 두 자릿수로 맞추기 위해 padStart 사용

    return `${year}-${month}-${day}`;
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
        <div className={"btn-wrap"}>
          <button
            className={"btn btn-dark-outline"}
            onClick={() => navigate("/cs/index")}
          >
            고객센터 홈
          </button>

          <button className={"btn btn-blue"} onClick={checkLoginOrNot}>
            작성
          </button>

          {isAuthenticated && (
            <button
              className={"btn btn-dark"}
              onClick={() => setShowMyInquiries((prev) => !prev)} // 내가 쓴 글 필터 토글
            >
              {showMyInquiries ? "전체글" : "내가 쓴 글"}
            </button>
          )}
        </div>

        <h1>문의하기</h1>

        <table className={"table-list"}>
          <thead>
            <tr>
              <th>#</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>

          <tbody>
            {filteredInquiries.length > 0 ? (
              filteredInquiries.map((inquiry) => (
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
                </tr>
              ))
            ) : (
              <td colSpan={4}>
                <div className={"empty-container"}>
                  <p className={"empty-container-title"}>
                    검색 결과가 없습니다.
                  </p>
                  <p className={"empty-container-description"}>
                    검색어를 확인해주세요.
                  </p>
                </div>
              </td>
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
