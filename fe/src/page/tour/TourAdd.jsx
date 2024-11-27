import React, { useState } from "react";
import { Box, Input, Stack, Textarea } from "@chakra-ui/react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { Field } from "../../components/ui/field.jsx";

export function TourAdd() {
  const [title, setTitle] = useState("");
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");

  const handleSaveClick = () => {
    axios.post(`/api/tour/add`, {
      title,
      product,
      price,
      content,
      writer,
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
          <Input
            defaultvalue={product}
            onChange={(e) => setProduct(e.target.value)}
          />
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
