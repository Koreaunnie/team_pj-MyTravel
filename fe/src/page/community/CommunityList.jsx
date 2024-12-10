import React, { useEffect, useState } from "react";
import {
  Box,
  createListCollection,
  HStack,
  Input,
  Stack,
  Table,
} from "@chakra-ui/react";
import { Button } from "../../components/ui/button.jsx";
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
import { IoMdPhotos } from "react-icons/io";

function CommunityList(props) {
  const [communityList, setCommunityList] = useState([]);
  const [search, setSearch] = useState({ type: "all", keyword: "" });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countCommunity, setCountCommunity] = useState("");
  const [numberOfFiles, setNumberOfFiles] = useState("");
  const [numberOfComments, setNumberOfComments] = useState("");

  useEffect(() => {
    axios.get(`/api/community/list?${searchParams.toString()}`).then((res) => {
      setCommunityList(res.data.list);
      setCountCommunity(res.data.countCommunity);
    });
  }, [searchParams]);
  console.log(communityList);

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
    // const pageURL = new URL(`http://localhost:5173/community/list?${pageQuery.toString()}`);
    navigate(`/community/list?${pageQuery.toString()}`);
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
        depth1={"커뮤니티"}
        navigateToDepth1={() => navigate(`/community/list`)}
      />
      <div>
        <br />
        {/*  NavBar*/}
        <Stack>
          <Box>
            <h1>커뮤니티</h1>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>번호</Table.ColumnHeader>
                  <Table.ColumnHeader>제목</Table.ColumnHeader>
                  <Table.ColumnHeader>작성자</Table.ColumnHeader>
                  <Table.ColumnHeader>작성일시</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {communityList.map((c) => (
                  <Table.Row onClick={() => handleViewClick(c.id)} key={c.id}>
                    <Table.Cell>{c.id}</Table.Cell>
                    <Table.Cell>
                      <Stack>
                        <HStack>
                          <h3>{c.title}</h3>
                          {c.existOfFiles ? <IoMdPhotos /> : " "}
                        </HStack>
                        <h4>댓글: {c.numberOfComments}</h4>
                      </Stack>
                    </Table.Cell>
                    <Table.Cell>{c.writer}</Table.Cell>
                    <Table.Cell>{c.creationDate}</Table.Cell>
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
              <Button onClick={handleWriteClick}>글 쓰기</Button>
            </HStack>
          </Box>
          <Box>
            <PaginationRoot
              count={countCommunity}
              pageSize={15}
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
        </Stack>
      </div>
    </div>
  );
}

export default CommunityList;
