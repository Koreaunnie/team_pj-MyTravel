import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaRegQuestionCircle } from "react-icons/fa";

function TourMyList(props) {
  const [tourList, setTourList] = useState([]);
  const { email } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/tour/list/${email}`).then((res) => setTourList(res.data));
  }, []);

  function handleRowClick(id) {
    navigate(`/tour/view/${id}`);
  }

  return (
    <div className={"tour-mylist"}>
      <h1>등록 상품</h1>
      {tourList.length === 0 ? (
        <div className={"empty-container"}>
          <p>
            <FaRegQuestionCircle
              className={"empty-container-icon"}
              style={{ color: "#a1a1a8" }}
            />
          </p>
          <p className={"empty-container-title"}>
            작성된 커뮤니티 게시물이 없습니다.
          </p>
          <p className={"empty-container-description"}>
            여행 이야기를 들려주세요.
          </p>
        </div>
      ) : (
        <table className={"table-list"}>
          <thead>
            <tr>
              <th>제목</th>
              <th>상품</th>
              <th>위치</th>
              <th>가격</th>
            </tr>
          </thead>
          <tbody>
            {tourList.map((tour) => (
              <tr key={tour.id} onClick={() => handleRowClick(tour.id)}>
                <td>{tour.title}</td>
                <td>{tour.product}</td>
                <td>{tour.location}</td>
                <td>{tour.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TourMyList;
