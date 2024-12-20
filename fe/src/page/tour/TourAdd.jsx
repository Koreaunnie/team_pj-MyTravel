import React, { useContext, useState } from "react";
import { Box, Center } from "@chakra-ui/react";
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
    navigate(`/access/denied`);
    return;
  }

  return (
    <div className={"tour-add"}>
      <Breadcrumb
        depth1={"투어"}
        navigateToDepth1={() => navigate(`/tour/list`)}
        depth2={"상품 등록"}
        navigateToDepth2={() => navigate(`/tour/add`)}
      />

      <h1>투어 상품 등록</h1>

      <div className={"body-normal"}>
        <label htmlFor={"title"}>상품명</label>
        <input
          value={title}
          type={"text"}
          id={"title"}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor={"product"}>상품</label>
        <input
          type={"text"}
          id={"product"}
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />

        <label htmlFor={"location"}>위치</label>
        <input
          type={"text"}
          id={"location"}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label htmlFor={"price"}>가격</label>
        <input
          type={"number"}
          id={"price"}
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

        <label htmlFor={"content"}>내용</label>
        <textarea
          rows={"10"}
          id={"content"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <Box>
          <Field
            helperText={
              "총 10MB, 한 파일은 1MB 이내의 이미지만 업로드 가능합니다."
            }
            invalid={fileInputInvalid}
            errorText={"선택한 파일이 업로드 가능한 용량을 초과하였습니다."}
          >
            <input
              type={"file"}
              accept={"image/*"}
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
          </Field>
          <Box>{filesList}</Box>
        </Box>
      </div>

      <Center>
        <div className={"btn-wrap"}>
          <button
            className={"btn btn-dark-outline"}
            onClick={handleToListClick}
          >
            목록
          </button>

          <button onClick={handleSaveClick} className={"btn btn-dark"}>
            등록
          </button>
        </div>
      </Center>
    </div>
  );
}
