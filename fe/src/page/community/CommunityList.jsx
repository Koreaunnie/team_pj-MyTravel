import React, { useEffect, useState } from "react";
import { Box, HStack, Input, Stack, Table } from "@chakra-ui/react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";

function CommunityList(props) {
  const [community, setCommunity] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/community/list`).then((res) => {
      setCommunity(res.data);
    });
  }, []);

  function handleWriteClick() {
    navigate(`/community/write`);
  }

  function handleViewClick(id) {
    navigate(`/community/view/${id}`);
  }

  function handleSearchClick() {
    // axios.get;
  }

  function handlePageChangeClick(e) {
    const pageNumber = { page: e.page };
    const pageQuery = new URLSearchParams(pageNumber);
    // const pageURL = new URL(`http://localhost:5173/community/list?${pageQuery.toString()}`);
    navigate(`/community/list?${pageQuery.toString()}`);
    axios
      .get(`/api/community/list?${pageQuery.toString()}`)
      .then((res) => setCommunity(res.data));
  }

  return (
    <div>
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
              {community.map((c) => (
                <Table.Row onClick={() => handleViewClick(c.id)} key={c.id}>
                  <Table.Cell>{c.id}</Table.Cell>
                  <Table.Cell>{c.title}</Table.Cell>
                  <Table.Cell>{c.writer}</Table.Cell>
                  <Table.Cell>{c.inserted}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
        <Box>
          <HStack>
            <Box>
              <HStack>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  w={300}
                />
                <Button onClick={handleSearchClick}>검색</Button>
              </HStack>
            </Box>
            <Button onClick={handleWriteClick}>글 쓰기</Button>
          </HStack>
        </Box>
        <PaginationRoot
          count={20}
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
      </Stack>
    </div>
  );
}

export default CommunityList;
