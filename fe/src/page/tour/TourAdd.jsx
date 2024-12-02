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
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleSaveClick = () => {
    axios
      .postForm(`/api/tour/add`, {
        title,
        product,
        price,
        location,
        content,
        files,
      })
      .then((res) => {
        const { message, data } = res.data;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate(`/tour/view/${data.id}`);
      })
      .catch((e) => {
        const message = e.response?.data?.message || {
          type: "error",
          text: "상품을 등록할 수 없습니다.",
        };
        toaster.create({
          type: message.type,
          description: message.text,
        });
      });
  };

  const filesList = [];

  for (const file of files) {
    filesList.push(<li>{file.name}</li>);
  }

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
        <Box>
          <Field label={"파일"}>
            <Input
              type={"file"}
              accept={"image/*"}
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
          </Field>
          <Box>{filesList}</Box>
        </Box>

        <Box>
          <Button onClick={handleSaveClick}>저장</Button>
        </Box>
      </Stack>
    </Box>
  );
}
