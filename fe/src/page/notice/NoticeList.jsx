import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import axios from "axios";
import {
  Box,
  createListCollection,
  HStack,
  Input,
  Stack,
  Table,
} from "@chakra-ui/react";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import { GoHeart } from "react-icons/go";
import { HiOutlineBookOpen } from "react-icons/hi";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../components/ui/select.jsx";
import { Button } from "../../components/ui/button.jsx";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";

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
  }, [searchParams]);

  function handleWriteClick() {
    navigate(`/notice/write`);
  }

  function handleViewClick(id) {
    navigate(`/notice/view/${id}`);
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
    <div>
      <Breadcrumb
        depth1={"공지사항"}
        navigateToDepth1={() => navigate(`/notice/list`)}
      />
      <div>
        <br />
        {/*  NavBar*/}
        <Stack>
          <Box>
            <h1>공지사항</h1>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>제목</Table.ColumnHeader>
                  <Table.ColumnHeader>작성자</Table.ColumnHeader>
                  <Table.ColumnHeader>작성일시</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {noticeList.map((n) => (
                  <Table.Row onClick={() => handleViewClick(n.id)} key={n.id}>
                    <Table.Cell>
                      <Stack>
                        <h3>{n.title}</h3>
                        <h4>
                          <HStack>
                            <GoHeart /> {n.numberOfLikes} |{" "}
                            <HiOutlineBookOpen /> {n.numberOfViews}
                          </HStack>
                        </h4>
                      </Stack>
                    </Table.Cell>
                    <Table.Cell>{n.writer}</Table.Cell>
                    <Table.Cell>{n.creationDate}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
          <Box>
            <HStack>
              <Box>
                <HStack>
                  <SelectRoot
                    collection={optionList}
                    defaultValue={["all"]}
                    onChange={(oc) =>
                      setSearch({ ...search, type: oc.target.value })
                    }
                    size="sm"
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
                  <Input
                    w={300}
                    value={search.keyword}
                    onChange={(e) =>
                      setSearch({ ...search, keyword: e.target.value })
                    }
                  />
                  <Button onClick={handleSearchClick}>검색</Button>
                </HStack>
              </Box>
              {authentication.isAdmin && (
                <Button onClick={handleWriteClick}>글 쓰기</Button>
              )}
            </HStack>
          </Box>
          <Box>
            <PaginationRoot
              count={countNotice}
              pageSize={10}
              defaultPage={1}
              onPageChange={handlePageChangeClick}
              siblingCount={2}
            >
              <HStack>
                <PaginationPrevTrigger />
                <PaginationItems />
                <PaginationNextTrigger />
              </HStack>
            </PaginationRoot>
          </Box>
          <br />
        </Stack>
        <br />
      </div>
    </div>
  );
}

export default NoticeList;
