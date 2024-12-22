import React, { useContext, useState } from "react";
import axios from "axios";
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
import { toaster } from "../../components/ui/toaster.jsx";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";

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
        const writeSuccess = e.data.message;
        toaster.create({
          type: writeSuccess.type,
          description: writeSuccess.text,
        });
        navigate(`/community/view/${e.data.id}`);
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
    navigate(`/community/list`);
  };

  return (
    <div className={"community-form form-container"}>
      {authentication.isAuthenticated && (
        <div className={"body-normal"}>
          <Breadcrumb
            depth1={"커뮤니티"}
            navigateToDepth1={() => navigate(`/community/list`)}
            depth2={"게시글 작성"}
            navigateToDepth1={() => navigate(`/community/list/write`)}
          />
          <div className={"form-wrap"}>
            <h1>게시글 작성</h1>
            <h2>여러분의 여행 이야기를 들려주세요.</h2>

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
              <label htmlFor="title">제목</label>
              <input
                type={"text"}
                id={"title"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <label htmlFor="content">본문</label>
              <textarea
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className={"attached"} style={{ marginTop: "10px" }}>
                <FileUploadRoot
                  value={files}
                  maxFiles={5}
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                >
                  <FileUploadTrigger asChild>
                    <Button variant="outline" size="sm">
                      <HiUpload /> 사진 첨부하기
                    </Button>
                  </FileUploadTrigger>
                  <FileUploadList showSize clearable />
                </FileUploadRoot>
              </div>
            </fieldset>
          </div>
        </div>
      )}
      {authentication.isAuthenticated || (
        <div>
          <Alert
            status="warning"
            title="로그인 한 회원만 게시글 작성이 가능합니다."
          />
          <MemberLogin />
        </div>
      )}
    </div>
  );
}

export default CommunityWrite;
