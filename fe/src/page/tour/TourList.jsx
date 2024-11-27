import React, { useEffect, useState } from "react";
import { Box, Table } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TourList() {
  const [tourList, setTourList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/tour/list`).then((res) => {
      setTourList(res.data);
    });
  }, []);

  function handleRowClick(id) {
    navigate(`/tour/view/${id}`);
  }

  return (
    <Box>
      <h1>Tour 목록</h1>

      {tourList.length === 0 ? (
        <p>찾으시는 상품이 존재하지 않습니다.</p>
      ) : (
        <Table.Root interactive>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>제목</Table.ColumnHeader>
              <Table.ColumnHeader>제품</Table.ColumnHeader>
              <Table.ColumnHeader>가격</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tourList.map((tour) => (
              <Table.Row onClick={() => handleRowClick(tour.id)} key={tour.id}>
                <Table.Cell>{tour.title}</Table.Cell>
                <Table.Cell>{tour.product}</Table.Cell>
                <Table.Cell>{tour.price}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
}

export default TourList;
