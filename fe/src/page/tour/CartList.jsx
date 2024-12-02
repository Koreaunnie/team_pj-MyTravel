import React, { useEffect, useState } from "react";
import { Box, Image, Table } from "@chakra-ui/react";
import axios from "axios";
import { Button } from "../../components/ui/button.jsx";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { Checkbox } from "../../components/ui/checkbox.jsx";

function CartList() {
  const [cartList, setCartList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/cart/list").then((res) => setCartList(res.data));
  }, []);

  function handleRowClick(id) {
    navigate(`/tour/view/${id}`);
  }

  const handleDeleteClick = (id) => {
    axios
      .delete(`/api/cart/delete/${id}`)
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        setCartList((prevList) => prevList.filter((cart) => cart.id !== id));
      })
      .catch((e) => {
        const data = e.response.data;
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
      });
  };

  return (
    <Box>
      <h1>장바구니 목록</h1>
      {cartList.length === 0 ? (
        <p>장바구니가 비어 있습니다.</p>
      ) : (
        <Table.Root interactive>
          <Table.Body>
            {cartList.map((cart) => (
              <Checkbox>
                <Table.Row
                  key={cart.id}
                  onClick={() => handleRowClick(cart.id)}
                >
                  <Image key={cart.image} src={cart.src} w="200px" />
                  <Table.Cell>{cart.title}</Table.Cell>
                  <Table.Cell>{cart.location}</Table.Cell>
                  <Table.Cell>{cart.product}</Table.Cell>
                  <Table.Cell>{cart.price}</Table.Cell>
                  <Button
                    key={cart.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(cart.id);
                    }}
                  >
                    삭제
                  </Button>
                </Table.Row>
              </Checkbox>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
}

export default CartList;
