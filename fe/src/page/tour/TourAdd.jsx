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
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [partner, setPartner] = useState("");
  const navigate = useNavigate();

  const handleSaveClick = () => {
    axios
      .post(`/api/tour/add`, {
        title,
        product,
        price,
        location,
        content,
        partner,
      })
      .then((res) => {
        console.log(res.data); // Inspect the response structure
        const { message, data } = res.data;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate(`/tour/view/${data.id}`);
      })
      .catch((e) => {
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
          <Input
            value={price}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setPrice(value);
              } else {
                toaster.create({
                  type: "warning",
                  description: "가격은 숫자만 입력 가능합니다.",
                });
              }
            }}
          />
        </Field>
        <Field label={"위치"}>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Field>
        <Field label={"본문"}>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Field>
        <Field label={"파트너사"}>
          <Input value={partner} onChange={(e) => setPartner(e.target.value)} />
        </Field>
        <Box>
          <Button onClick={handleSaveClick}>저장</Button>
        </Box>
      </Stack>
    </Box>
  );
}
