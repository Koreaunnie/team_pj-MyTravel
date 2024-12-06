import React, { useState } from "react";
import axios from "axios";
import { Box, HStack, Input, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { useNavigate } from "react-router-dom";

function CommunityWrite(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleSaveClick = () => {
    // 파일을 배열로 변환
    const filesArray = Array.from(files);

    // axios.postForm 사용
    axios
      .postForm("/api/community/write", {
        title,
        content,
        files: filesArray,
      })
      .then(() => {
        navigate(`/community/list`);
      });
  };

  const filesList = [];

  for (const file of files) {
    filesList.push(<li>{file.name}</li>);
  }

  return (
    <div>
      <h1>게시글 작성</h1>
      <Box
        mx={"auto"}
        w={{
          md: "500px",
        }}
      >
        <Field label={"제목"}>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label={"본문"}>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            h={300}
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

        {/*<Field label={"파일 첨부"}>*/}
        {/*  <FileUploadRoot*/}
        {/*    value={files}*/}
        {/*    maxFiles={5}*/}
        {/*    multiple*/}
        {/*    onChange={(e) => setFiles(e.target.files)}*/}
        {/*  >*/}
        {/*    <FileUploadTrigger asChild>*/}
        {/*      <Button variant="outline" size="sm">*/}
        {/*        <HiUpload /> Upload file*/}
        {/*      </Button>*/}
        {/*    </FileUploadTrigger>*/}
        {/*    <FileUploadList showSize clearable />*/}
        {/*  </FileUploadRoot>*/}
        {/*</Field>*/}
        <br />
        <Box>
          <HStack>
            <Button>취소</Button>
            <Button onClick={handleSaveClick}>저장</Button>
          </HStack>
        </Box>
      </Box>
    </div>
  );
}

export default CommunityWrite;
