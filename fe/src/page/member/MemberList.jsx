import React, { useEffect, useState } from "react";
import { Box, Spinner, Table } from "@chakra-ui/react";
import axios from "axios";

function MemberList(props) {
  const [memberList, setMemberList] = useState([]);

  useEffect(() => {
    axios.get("/api/member/list").then((res) => setMemberList(res.data));
  }, []);

  if (!memberList || memberList.length === 0) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>회원 목록</h1>
      <Table.Root interactive>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>닉네임</Table.ColumnHeader>
            <Table.ColumnHeader>가입일시</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {memberList.map((member) => (
            <Table.Row key={member.email}>
              <Table.Cell>{member.email}</Table.Cell>
              <Table.Cell>{member.nickname}</Table.Cell>
              <Table.Cell>{member.inserted}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}

export default MemberList;
