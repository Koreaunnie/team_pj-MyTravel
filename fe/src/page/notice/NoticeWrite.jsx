import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import { Alert } from "../../components/ui/alert.jsx";
import NoticeList from "./NoticeList.jsx";
import { toaster } from "../../components/ui/toaster.jsx";

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
    <div className={"notice-form form-container"}>
      {authentication.isAdmin && (
        <div className={"body-normal"}>
          <h1>공지사항 작성</h1>

          <div className={"form-wrap"}>
            <div className={"btn-wrap"}>
              <button
                className={"btn btn-dark-outline"}
                onClick={handleCancelClick}
              >
                목록
              </button>

              <button className={"btn btn-dark"} onClick={handleSaveClick}>
                저장
              </button>
            </div>

            <fieldset>
              <label htmlFor={"title"}>제목</label>
              <input
                type={"text"}
                value={title}
                id={"title"}
                onChange={(e) => setTitle(e.target.value)}
              />

              <label htmlFor="content">본문</label>
              <textarea
                rows={15}
                value={content}
                id={"content"}
                onChange={(e) => setContent(e.target.value)}
              />
            </fieldset>
          </div>
        </div>
      )}

      {authentication.isAdmin || (
        <Box>
          <Alert status="warning" title="공지사항 작성 권한이 없습니다." />
          <NoticeList />
        </Box>
      )}
    </div>
  );
}

export default NoticeWrite;
