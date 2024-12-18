import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
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
      <table className={"table-list"}>
        <thead>
          <tr>
            <th>기업명</th>
            <th>Email</th>
            <th>담당자</th>
            <th>가입일시</th>
          </tr>
        </thead>

        <tbody>
          {partnerList.map((member) => (
            <tr onClick={() => handleRowClick(member.email)} key={member.email}>
              <td>{member.nickname}</td>
              <td>{member.email}</td>
              <td>{member.name}</td>
              <td>{member.inserted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}

export default MemberList;
