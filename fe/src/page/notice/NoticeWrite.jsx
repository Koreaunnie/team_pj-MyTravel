import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import axios from "axios";
import { Box, HStack, Input, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Alert } from "../../components/ui/alert.jsx";
import NoticeList from "./NoticeList.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";

function NoticeWrite(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const authentication = useContext(AuthenticationContext);

  const handleSaveClick = () => {
    axios
      .post(`/api/notice/write`, { title, content })
      .then((e) => {
        const writeSuccess = e.data.message;
        toaster.create({
          type: writeSuccess.type,
          description: writeSuccess.text,
        });
        navigate(`/notice/view/${e.data.id}`);
      })
      .catch((e) => {
        const writeFailure = e.request.response;
        const parsingKey = JSON.parse(writeFailure);
        const type = parsingKey.message.type;
        const text = parsingKey.message.text;
        toaster.create({
          type: type,
          description: text,
        });
      });
  };

  const handleCancelClick = () => {
    navigate(`/notice/list`);
  };

  return (
    <div>
      {authentication.isAdmin && (
        <div>
          <Breadcrumb
            depth1={"공지사항"}
            navigateToDepth1={() => navigate(`/notice/list`)}
            depth2={"공지사항 작성"}
            navigateToDepth2={() => navigate(`/notice/write`)}
          />
          <br />
          <br />
          <Box>
            <h1>공지사항 작성</h1>
            <Box
              mx={"auto"}
              w={{
                md: "500px",
              }}
            >
              <Field label={"제목"}>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>
              <Field label={"본문"}>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  h={300}
                />
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
        </div>
      )}
      {authentication.isAdmin || (
        <Box>
          <br />
          <br />
          <Alert status="warning" title="공지사항 작성 권한이 없습니다." />
          <NoticeList />
        </Box>
      )}
    </div>
  );
}

export default NoticeWrite;
