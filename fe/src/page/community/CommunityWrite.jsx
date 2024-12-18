import React, { useContext, useState } from "react";
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
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import MemberLogin from "../member/MemberLogin.jsx";
import { Alert } from "../../components/ui/alert.jsx";

function CommunityWrite(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const authentication = useContext(AuthenticationContext);

  const handleSaveClick = () => {
    axios
      .postForm(`/api/community/write`, { title, content, files })
      .then((e) => {
        navigate(`/community/view/${e.data.id}`);
      });
  };

  const handleCancelClick = () => {
    navigate(`/community/list`);
  };

  return (
    <div>
      {authentication.isAuthenticated && (
        <Box>
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
                value={files}
                maxFiles={5}
                multiple
                onChange={(e) => setFiles(e.target.files)}
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
                <Button onClick={handleCancelClick}>취소</Button>
                <Button onClick={handleSaveClick}>저장</Button>
              </HStack>
            </Box>
          </Box>
        </Box>
      )}
      {authentication.isAuthenticated || (
        <Box>
          <Alert
            status="warning"
            title="로그인 한 회원만 게시글 작성이 가능합니다."
          />
          <MemberLogin />
        </Box>
      )}
    </div>
  );
}

export default CommunityWrite;
