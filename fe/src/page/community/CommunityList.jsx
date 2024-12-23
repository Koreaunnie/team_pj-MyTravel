import React, { useContext, useEffect, useState } from "react";
import { Center, createListCollection, HStack } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../components/ui/select.jsx";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import { IoIosRefresh, IoMdPhotos } from "react-icons/io";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { HiOutlineBookOpen } from "react-icons/hi";
import { formattedDateTime } from "../../components/utils/FormattedDateTime.jsx";
import "./Community.css";

function CommunityList(props) {
  const [communityList, setCommunityList] = useState([]);
  const [search, setSearch] = useState({ type: "all", keyword: "" });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countCommunity, setCountCommunity] = useState("");
  const authentication = useContext(AuthenticationContext);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1,
  );

  useEffect(() => {
    axios.get(`/api/community/list?${searchParams.toString()}`).then((res) => {
      setCommunityList(res.data.list);
      setCountCommunity(res.data.countCommunity);
      console.log(res.data);
    });
    window.scrollTo(0, 0);
  }, [searchParams]);

  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    setCurrentPage(page);
  }, [searchParams]);

  function handleWriteClick() {
    navigate(`/community/write`);
  }

  function handleViewClick(id) {
    navigate(`/community/view/${id}`);
  }

  function handleSearchClick() {
    const searchInfo = { type: search.type, keyword: search.keyword };
    const searchQuery = new URLSearchParams(searchInfo);
    navigate(`/community/list?${searchQuery.toString()}`);
  }

  function handlePageChangeClick(e) {
    const pageNumber = { page: e.page };
    const pageQuery = new URLSearchParams(pageNumber);
    const searchInfo = { type: search.type, keyword: search.keyword };
    const searchQuery = new URLSearchParams(searchInfo);
    navigate(
      `/community/list?${searchQuery.toString()}&${pageQuery.toString()}`,
    );
  }

  function handleLoginClick() {
    navigate(`/member/login`);
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
    <div className={"community"}>
      <Breadcrumb
        depth1={"커뮤니티"}
        navigateToDepth1={() => navigate(`/community/list`)}
      />

      <div className={"body-normal"}>
        <h1>커뮤니티</h1>
        <h2>여러분의 여행 이야기를 들려주세요.</h2>

        <div className={"btn-wrap"}>
          {authentication.isAuthenticated && (
            <button className={"btn btn-dark"} onClick={handleWriteClick}>
              글 쓰기
            </button>
          )}

          {authentication.isAuthenticated || (
            <div className={"community-login"}>
              <p>로그인 후 게시글 작성이 가능합니다.</p>
              <button className={"btn btn-dark"} onClick={handleLoginClick}>
                로그인
              </button>
            </div>
          )}
        </div>

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

        <div className="community-container">
          {communityList.map((c) => (
            <ul
              className="community-list"
              key={c.id}
              onClick={() => handleViewClick(c.id)}
            >
              <div className={"community-header"}>
                <li className="community-title">
                  {c.title}
                  <span>{c.existOfFiles ? <IoMdPhotos /> : " "}</span>
                </li>
                <li className="community-writer">{c.writer}</li>
              </div>

              <li className="community-content">
                {c.content.length > 40
                  ? `${c.content.substring(0, 40)} ...`
                  : c.content}
              </li>

              <div className="community-footer">
                <li>❤️ {c.numberOfLikes}</li>
                <li>💬 {c.numberOfComments}</li>
                <li>
                  <HiOutlineBookOpen
                    style={{
                      display: "inline",
                      marginTop: "-2px",
                      marginRight: "4px",
                    }}
                  />
                  {c.numberOfViews}
                </li>
              </div>

              <li className="community-date">
                {formattedDateTime(c.creationDate)}
              </li>
            </ul>
          ))}
        </div>

        <div className={"pagination"}>
          <Center>
            <PaginationRoot
              count={countCommunity}
              pageSize={10}
              defaultPage={currentPage}
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
  );
}

export default CommunityList;
