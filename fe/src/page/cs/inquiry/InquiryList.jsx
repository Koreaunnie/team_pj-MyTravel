import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../../components/root/Breadcrumb.jsx";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function InquiryList(props) {
  const [inquiryList, setInquiryList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/cs/inquiry/list").then((res) => setInquiryList(res.data));
  }, []);

  if (!inquiryList || inquiryList.length === 0) {
    return <Spinner />;
  }

  return (
    <div className={"inquiry"}>
      <Breadcrumb
        depth1={"고객센터"}
        navigateToDepth1={() => navigate(`/cs`)}
        depth2={"문의하기"}
        navigateToDepth2={() => navigate(`/cs/inquiry/list`)}
      />

      <div className={"body-normal"}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>

          <tbody>
            {inquiryList.map((inquiry) => (
              <tr
                key={inquiry.id}
                onClick={() => navigate(`/inquiry/view/${id}`)}
              >
                <th>{inquiry.id}</th>
                <td>{inquiry.title}</td>
                <td>{inquiry.writer}</td>
                <td>{inquiry.inserted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InquiryList;
