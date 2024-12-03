import React, { useState } from "react";
import axios from "axios";
import { Box, HStack, Input, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { useNavigate } from "react-router-dom";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "../../components/ui/file-button.jsx";
import { HiUpload } from "react-icons/hi";

function CommunityWrite(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  const navigate = useNavigate();

  const handleSaveClick = () => {
    axios
      .post(`/api/community/write`, { title, content, files })
      .then(navigate(`/community/list`));
  };

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
        <Field label={"파일 첨부"}>
          <FileUploadRoot
            maxFiles={5}
            onChange={(e) => setFiles(e.target.value)}
          >
            <FileUploadTrigger asChild>
              <Button variant="outline" size="sm">
                <HiUpload /> Upload file
              </Button>
            </FileUploadTrigger>
            <FileUploadList showSize clearable />
          </FileUploadRoot>
        </Field>
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
