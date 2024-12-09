import React, { useEffect, useState } from "react";
import { Box, Table } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MemberList(props) {
  const [partnerList, setPartnerList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/member/partners").then((res) => setPartnerList(res.data));
  }, []);

  function handleRowClick(email) {
    navigate(`/member/${email}`);
  }

  return (
    <Box>
      <h1>회원 목록</h1>
      <Table.Root interactive>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>기업명</Table.ColumnHeader>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>담당자</Table.ColumnHeader>
            <Table.ColumnHeader>가입일시</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {partnerList.map((member) => (
            <Table.Row
              onClick={() => handleRowClick(member.email)}
              key={member.email}
            >
              <Table.Cell>{member.nickname}</Table.Cell>
              <Table.Cell>{member.email}</Table.Cell>
              <Table.Cell>{member.name}</Table.Cell>
              <Table.Cell>{member.inserted}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}

export default MemberList;
