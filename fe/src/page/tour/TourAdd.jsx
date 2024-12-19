import React, { useContext, useState } from "react";
import { Box, Input, Stack, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { Field } from "../../components/ui/field.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";

export function TourAdd() {
  const [title, setTitle] = useState("");
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const { userToken, isPartner, isAdmin } = useContext(AuthenticationContext);
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

  const handleToListClick = () => {
    navigate("/tour/list");
  };

  const filesList = [];
  let sumOfFileSize = 0;
  let invalidOneFileSize = false;
  for (const file of files) {
    sumOfFileSize += file.size;
    if (file.size > 1024 * 1024) {
      invalidOneFileSize = true;
    }
    filesList.push(
      <li style={{ color: file.size > 1024 * 1024 ? "red" : "black" }}>
        {file.name} ({Math.floor(file.size / 1024)}kb)
      </li>,
    );
  }

  let fileInputInvalid = false;
  if (sumOfFileSize > 10 * 1024 * 1024 || invalidOneFileSize) {
    fileInputInvalid = true;
  }

  if (!userToken || (!isPartner && !isAdmin)) {
    return (
      <div>
        접근 권한이 없습니다. <a href="/member/login">로그인 페이지로</a>
      </div>
    );
  }

  return (
    <div className={"tour"}>
      <Breadcrumb
        depth1={"투어"}
        navigateToDepth1={() => navigate(`/tour/list`)}
        depth2={"상품 등록"}
        navigateToDepth2={() => navigate(`/tour/add`)}
      />

      <Box>
        <button className={"btn btn-dark-outline"} onClick={handleToListClick}>
          목록으로
        </button>
        <button onClick={handleSaveClick} className={"btn btn-dark"}>
          등록
        </button>
      </Box>

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
          <Field
            label={"파일"}
            helperText={
              "총 10MB, 한 파일은 1MB 이내의 이미지만 업로드 가능합니다."
            }
            invalid={fileInputInvalid}
            errorText={"선택한 파일이 업로드 가능한 용량을 초과하였습니다."}
          >
            <Input
              type={"file"}
              accept={"image/*"}
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
          </Field>
          <Box>{filesList}</Box>
        </Box>
      </Stack>
    </div>
  );
}
