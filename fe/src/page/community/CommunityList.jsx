import React, { useEffect } from "react";
import { Box, Table } from "@chakra-ui/react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { useParams } from "react-router-dom";

function CommunityList(props) {
  const number = useParams();

  useEffect(() => {
    axios.get(`/community/list?page=${number}`);
  }, []);

  const handleWriteClick = () => {};

  return (
    <div>
      {/*  NavBar*/}
      <Box>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>제목</Table.ColumnHeader>
              <Table.ColumnHeader>작성자</Table.ColumnHeader>
              <Table.ColumnHeader>작성일시</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>${community.title}</Table.Cell>
              <Table.Cell>${community.writer}</Table.Cell>
              <Table.Cell>${community.creationDate}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Box>
      <Box>
        <Button onClick={handleWriteClick}>글 쓰기</Button>
      </Box>
    </div>
  );
}

// TODO : 페이지네이션 추가
export default CommunityList;
