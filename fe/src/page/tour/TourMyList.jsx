import React, { useState } from "react";
import { Image } from "@chakra-ui/react";

function TourMyList(props) {
  const [tourList, setTourList] = useState([]);

  return (
    <div>
      <h1>등록 상품</h1>
      {tourList.length === 0 ? (
        <p>아직 등록한 상품이 없습니다.</p>
      ) : (
        <table className={"table-list"}>
          <thead>
            <tr>
              <th>상품 이미지</th>
              <th>제목</th>
              <th>상품</th>
              <th>위치</th>
              <th>가격</th>
            </tr>
          </thead>
          <tbody>
            {tourList.map((tour) => (
              <tr>
                <Image key={tour.image} src={tour.src} />
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
