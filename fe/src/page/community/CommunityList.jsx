import React, { useEffect, useState } from "react";
import { Box, Stack, Table } from "@chakra-ui/react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CommunityList(props) {
  const [community, setCommunity] = useState([]);
  // const number = useParams();
  // const [communityList, setCommunityList] = useState([]);
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
          <Button onClick={handleWriteClick}>글 쓰기</Button>
        </Box>
      </Stack>
    </div>
  );
}

// TODO : 페이지네이션 추가
export default CommunityList;
