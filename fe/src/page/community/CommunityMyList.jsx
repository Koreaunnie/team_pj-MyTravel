import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function CommunityMyList(props) {
  const [communityList, setCommunityList] = useState([]);
  const { email } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/community/wholeList/${email}`)
      .then((res) => setCommunityList(res.data));
  }, []);
  console.log(communityList);

  function handleRowClick(id) {
    navigate(`/community/view/${id}`);
  }

  return (
    <div>
      <h1>커뮤니티</h1>
      {communityList.length === 0 ? (
        <p>작성된 커뮤니티 게시물이 없습니다.</p>
      ) : (
        <table className={"table-list"}>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성일자</th>
            </tr>
          </thead>
          <tbody>
            {communityList.map((c) => (
              <tr key={c.id} onClick={() => handleRowClick(c.id)}>
                <td>{c.id}</td>
                <td>{c.title}</td>
                <td>{c.creationDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CommunityMyList;
