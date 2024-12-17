import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import axios from "axios";
import { Box, HStack, Input, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Alert } from "../../components/ui/alert.jsx";
import NoticeList from "./NoticeList.jsx";

function NoticeWrite(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const authentication = useContext(AuthenticationContext);

  const handleSaveClick = () => {
    axios
      .post(`/api/notice/write`, { title, content })
      .then(navigate(`/notice/list`));
  };

  const handleCancelClick = () => {
    navigate(`/notice/list`);
  };

  return (
    <div>
      {authentication.isAdmin && (
        <Box>
          <h1>공지사항 작성</h1>
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
