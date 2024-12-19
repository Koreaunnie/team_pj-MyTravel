import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import axios from "axios";
import { Center, createListCollection, HStack } from "@chakra-ui/react";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
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
import "./Notice.css";
import { formattedDate } from "../../components/utils/FormattedDate.jsx";
import { IoIosRefresh } from "react-icons/io";

function NoticeList(props) {
  const [noticeList, setNoticeList] = useState([]);
  const [search, setSearch] = useState({ type: "all", keyword: "" });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countNotice, setCountNotice] = useState("");
  const authentication = useContext(AuthenticationContext);

  useEffect(() => {
    axios.get(`/api/notice/list?${searchParams.toString()}`).then((res) => {
      setNoticeList(res.data.list);
      setCountNotice(res.data.countNotice);
    });
    window.scrollTo(0, 0);
  }, [searchParams]);

  function handleWriteClick() {
    navigate(`/notice/write`);
  }

  function handleViewClick(id) {
    navigate(`/notice/view/${id}#top`);
  }

  function handleSearchClick() {
    const searchInfo = { type: search.type, keyword: search.keyword };
    const searchQuery = new URLSearchParams(searchInfo);
    navigate(`/notice/list?${searchQuery.toString()}`);
  }

  function handlePageChangeClick(e) {
    const pageNumber = { page: e.page };
    const pageQuery = new URLSearchParams(pageNumber);
    const searchInfo = { type: search.type, keyword: search.keyword };
    const searchQuery = new URLSearchParams(searchInfo);
    // const pageURL = new URL(`http://localhost:5173/community/list?${pageQuery.toString()}`);
    navigate(`/notice/list?${searchQuery.toString()}&${pageQuery.toString()}`);
  }

  const optionList = createListCollection({
    items: [
      { label: "전체", value: "all" },
      { label: "제목", value: "title" },
      { label: "본문", value: "content" },
      { label: "작성자", value: "writer" },
    ],
  });

  return (
    <div className={"notice"}>
      <Breadcrumb
        depth1={"공지사항"}
        navigateToDepth1={() => navigate(`/notice/list`)}
      />

      <div className={"body-normal"}>
        <h1>공지사항</h1>
        <h2>공지사항 외 문의는 문의 게시판을 이용해주세요.</h2>

        <div className={"btn-wrap"}>
          {authentication.isAdmin && (
            <button className={"btn btn-dark"} onClick={handleWriteClick}>
              글 쓰기
            </button>
          )}
        </div>

        <div className={"notice-search"}>
          <Center>
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
            <input
              type={"text"}
              className={"search-form-input"}
              value={search.keyword}
              onChange={(e) =>
                setSearch({ ...search, keyword: e.target.value })
              }
            />
            <button
              className={"btn-search btn-dark"}
              onClick={handleSearchClick}
            >
              검색
            </button>
          </Center>
        </div>

        <div>
          <table className={"table-list"}>
            <thead>
              <tr>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일시</th>
              </tr>
            </thead>

            <tbody>
              {noticeList.map((n) => (
                <tr onClick={() => handleViewClick(n.id)} key={n.id}>
                  <td>
                    <p className={"title"}>{n.title}</p>
                    <div className="info">
                      <span>❤️ {n.numberOfLikes}</span>
                      <span>💬 {n.numberOfViews}</span>
                    </div>
                  </td>
                  <td className={"writer"}>{n.writer}</td>
                  <td>{formattedDate(n.creationDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={"pagination"}>
            <Center>
              <PaginationRoot
                count={countNotice}
                pageSize={10}
                defaultPage={1}
                onPageChange={handlePageChangeClick}
                siblingCount={2}
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

export default NoticeList;
