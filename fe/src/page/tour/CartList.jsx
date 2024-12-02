import React, { useEffect, useState } from "react";
import { Box, Table } from "@chakra-ui/react";
import axios from "axios";

function CartList() {
  const [cartList, setCartList] = useState([]);

  useEffect(() => {
    axios.get("/api/cart/list").then((res) => setCartList(res.data));
  }, []);

  return (
    <Box>
      <h1>장바구니 목록</h1>
      {cartList.length === 0 ? (
        <p>장바구니가 비어 있습니다.</p>
      ) : (
        <Table.Root interactive>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>제목</Table.ColumnHeader>
              <Table.ColumnHeader>위치</Table.ColumnHeader>
              <Table.ColumnHeader>상품명</Table.ColumnHeader>
              <Table.ColumnHeader>가격</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {cartList.map((cart) => (
              <Table.Row key={cart.id}>
                <Table.Cell>{cart.title}</Table.Cell>
                <Table.Cell>{cart.location}</Table.Cell>
                <Table.Cell>{cart.product}</Table.Cell>
                <Table.Cell>{cart.price}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
}

export default CartList;
