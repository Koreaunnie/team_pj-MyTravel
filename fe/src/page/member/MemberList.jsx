import React, { useEffect, useState } from "react";
import { Box, Spinner, Table } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MemberList(props) {
  const [memberList, setMemberList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/member/list").then((res) => setMemberList(res.data));
  }, []);

  function handleRowClick(email) {
    navigate(`/member/${email}`);
  }

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
            <Table.Row
              onClick={() => handleRowClick(member.email)}
              key={member.email}
            >
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
