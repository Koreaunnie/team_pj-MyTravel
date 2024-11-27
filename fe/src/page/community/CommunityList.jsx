import React, { useEffect, useState } from "react";
import { Box, Table } from "@chakra-ui/react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";

function CommunityList(props) {
  const [community, setCommunity] = useState([]);
  // const number = useParams();
  // const [communityList, setCommunityList] = useState([]);

  useEffect(() => {
    axios.get(`/api/community/list`).then((res) => {
      setCommunity(res.data);
    });
  }, []);

  const handleWriteClick = () => {
    axios.post(`/api/community/write`);
  };

  return (
    <div>
      {/*  NavBar*/}
      <Box>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>제목</Table.ColumnHeader>
              <Table.ColumnHeader>작성자</Table.ColumnHeader>
              <Table.ColumnHeader>작성일시</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {community.map((c) => (
              <Table.Row>
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
    </div>
  );
}

// TODO : 페이지네이션 추가
export default CommunityList;
