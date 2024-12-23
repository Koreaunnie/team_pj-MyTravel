import React, { useEffect, useState } from "react";
import { Box, Center, createListCollection, HStack } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoIosRefresh } from "react-icons/io";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../components/ui/select.jsx";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";

function MemberList(props) {
  const [memberList, setMemberList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [count, setCount] = useState(0);
  // const [currentPage, setCurrentPage] = useState(
  //   parseInt(searchParams.get("page")) || 1,
  // );
  const [search, setSearch] = useState({ type: "all", keyword: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // const controller = new AbortController();
    axios
      .get("/api/member/list", {
        params: {
          menu: "memberList",
          type: searchParams.get("type") || "all", // use URL params directly
          key: searchParams.get("key") || "", // use URL params directly
          page: searchParams.get("page") || "1",
        },
        // signal: controller.signal,
      })
      .then((res) => {
        setMemberList(res.data.memberList);
        setCount(res.data.count);
      });
    // return () => {
    //   controller.abort();
    // };
  }, [searchParams]);

  useEffect(() => {
    const nextSearch = { ...search };

    if (searchParams.get("type")) {
      nextSearch.type = searchParams.get("type");
    } else {
      nextSearch.type = "all";
    }

    if (searchParams.get("key")) {
      nextSearch.keyword = searchParams.get("key");
    } else {
      nextSearch.keyword = "";
    }

    setSearch(nextSearch);
  }, [searchParams]);

  // const pageParam = searchParams.get("page") ?? "1";
  // const page = Number(pageParam);

  function handleRowClick(email) {
    navigate(`/member/${email}`);
  }

  const optionList = createListCollection({
    items: [
      { label: "전체", value: "all" },
      { label: "이메일", value: "email" },
      { label: "닉네임", value: "nickname" },
      { label: "이름", value: "name" },
      { label: "전화번호", value: "phone" },
    ],
  });

  function handleSearchClick() {
    const nextSearchParam = new URLSearchParams(searchParams);

    if (search.keyword.trim().length > 0) {
      nextSearchParam.set("type", search.type);
      nextSearchParam.set("key", search.keyword);
      nextSearchParam.set("page", "1");
    } else {
      nextSearchParam.delete("type");
      nextSearchParam.delete("key");
    }

    setSearchParams(nextSearchParam);
  }

  // function handlePageChange(e) {
  //   const pageNumber = { page: e.page };
  //   const pageQuery = new URLSearchParams(pageNumber);
  //   const searchInfo = { type: search.type, key: search.keyword };
  //   const searchQuery = new URLSearchParams(searchInfo);
  //   navigate(
  //     `/admin?menu=memberList&${searchQuery.toString()}&${pageQuery.toString()}`,
  //   );
  // }

  //pagination
  const pageParam = searchParams.get("page") ?? "1";
  const page = Number(pageParam);

  // 페이지 번호 변경 시 URL 의 쿼리 파라미터를 업데이트
  function handlePageChange(e) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", e.page);
    setSearchParams(nextSearchParams);
  }

  return (
    <Box>
      <h1>회원 목록</h1>
      <div className={"search-form"}>
        <button
          onClick={() => {
            // 1. 검색 상태 초기화
            setSearch({ type: "all", keyword: "" });

            // 2. URL 검색 파라미터 초기화
            const nextSearchParam = new URLSearchParams();
            nextSearchParam.set("menu", "memberList");
            nextSearchParam.set("type", "all");
            nextSearchParam.set("key", "");

            setSearchParams(nextSearchParam);
          }}
          style={{ marginRight: "10px", cursor: "pointer" }}
        >
          <IoIosRefresh />
        </button>

        <SelectRoot
          collection={optionList}
          defaultValue={["all"]}
          onChange={(oc) => setSearch({ ...search, type: oc.target.value })}
          size="md"
          width="130px"
        >
          <SelectTrigger>
            <SelectValueText />
          </SelectTrigger>
          <SelectContent>
            {optionList.items.map((option) => (
              <SelectItem item={option} key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>

        <div className={"search-form-input"}>
          <input
            type={"text"}
            value={search.keyword}
            onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchClick();
              }
            }}
          />
          <button className={"btn-search btn-dark"} onClick={handleSearchClick}>
            검색
          </button>
        </div>
      </div>
      <div>
        <table className={"table-list"}>
          <thead>
            <tr>
              <th>Email</th>
              <th>닉네임</th>
              <th>가입일시</th>
            </tr>
          </thead>

          <tbody>
            {memberList.map((member) => (
              <tr
                onClick={() => handleRowClick(member.email)}
                key={member.email}
              >
                <td>{member.email}</td>
                <td>{member.nickname}</td>
                <td>{member.inserted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* pagination */}
      <div className="pagination">
        <Center>
          <PaginationRoot
            count={count}
            pageSize={10}
            page={page}
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
    </Box>
  );
}

export default MemberList;
