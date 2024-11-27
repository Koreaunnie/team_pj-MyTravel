import React, { useState } from "react";
import { Box, Input, Stack, Textarea } from "@chakra-ui/react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { Field } from "../../components/ui/field.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { useNavigate } from "react-router-dom";

export function TourAdd() {
  const [title, setTitle] = useState("");
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");
  const navigate = useNavigate();

  const handleSaveClick = () => {
    axios
      .post(`/api/tour/add`, {
        title,
        product,
        price,
        content,
        writer,
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        console.log(data);
        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate(`/tour/view/${data.data.id}`);
      })
      .cath((e) => {
        const message = e.response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      });
  };

  return (
    <Box>
      <h1>Tour 상품 추가</h1>
      <Stack>
        <Field label={"제목"}>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label={"제품"}>
          <Input value={product} onChange={(e) => setProduct(e.target.value)} />
        </Field>
        <Field label={"가격"}>
          <Input value={price} onChange={(e) => setPrice(e.target.value)} />
        </Field>
        <Field label={"본문"}>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Field>
        <Field label={"작성자"}>
          <Input value={writer} onChange={(e) => setWriter(e.target.value)} />
        </Field>
        <Box>
          <Button onClick={handleSaveClick}>저장</Button>
        </Box>
      </Stack>
    </Box>
  );
}
