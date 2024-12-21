import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
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

  return (
    <Box>
      <h1>회원 목록</h1>
      <table className={"table-list"}>
        <thead>
          <tr>
            <th>Email</th>
            <th>닉네임</th>
            <th>가입일시</th>
          </tr>
        </thead>

        <tbody>
          {memberList.map((member) => (
            <tr onClick={() => handleRowClick(member.email)} key={member.email}>
              <td>{member.email}</td>
              <td>{member.nickname}</td>
              <td>{member.inserted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}

export default MemberList;
