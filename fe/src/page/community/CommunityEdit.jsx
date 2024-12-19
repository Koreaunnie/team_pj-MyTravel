import React, { useContext, useEffect, useState } from "react";
import { HStack, Image } from "@chakra-ui/react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "../../components/ui/file-button.jsx";
import { HiUpload } from "react-icons/hi";
import { CloseButton } from "../../components/ui/close-button.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { Alert } from "../../components/ui/alert.jsx";
import CommunityList from "./CommunityList.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";

function CommunityEdit(props) {
  const [community, setCommunity] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [fileList, setFileList] = useState([]);
  const { hasAccessByNickName } = useContext(AuthenticationContext);

  useEffect(() => {
    axios.get(`/api/community/view/${id}`).then((res) => {
      setCommunity(res.data);
      setFileList(res.data.files);
    });
  }, []);

  const handleSaveClick = () => {
    axios
      .putForm(`/api/community/edit`, {
        id: community.id,
        title: community.title,
        content: community.content,
        removeFiles,
        uploadFiles: files,
      })
      .then((e) => {
        const updateSuccess = e.data.message;
        toaster.create({
          type: updateSuccess.type,
          description: updateSuccess.text,
        });
        navigate(`/community/view/${e.data.id}`);
      })
      .catch((e) => {
        const updateFailure = e.request.response;
        const parsingKey = JSON.parse(updateFailure);
        const type = parsingKey.message.type;
        const text = parsingKey.message.text;
        toaster.create({
          type: type,
          description: text,
        });
      });
  };

  const handleCancelClick = () => {
    navigate(`/community/view/${id}`);
  };

  const handleDeleteFileClick = (file) => {
    setRemoveFiles([...removeFiles, file.id]);
    setFileList(() => fileList.filter((item) => item !== file));
  };

  return (
    <div className={"community-form form-container"}>
      <Breadcrumb
        depth1={"커뮤니티"}
        navigateToDepth1={() => navigate(`/community/list`)}
        depth2={"게시글 수정"}
        navigateToDepth2={() => navigate(`/community/edit/${id}`)}
      />

      {hasAccessByNickName(community.writer) && (
        <div className={"body-normal"}>
          <div className={"form-wrap"}>
            <h1>게시글 수정</h1>
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
                value={community.title}
                onChange={(e) =>
                  setCommunity({ ...community, title: e.target.value })
                }
              />

              <label htmlFor="content">본문</label>
              <textarea
                rows={10}
                id={"content"}
                value={community.content}
                onChange={(e) =>
                  setCommunity({ ...community, content: e.target.value })
                }
              />

              <div>
                <FileUploadRoot
                  value={files}
                  maxFiles={5}
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                >
                  <FileUploadTrigger asChild>
                    <div>
                      <Button
                        className={"btn btn-wide"}
                        variant="outline"
                        size="sm"
                      >
                        <HiUpload /> Upload file
                      </Button>
                    </div>
                  </FileUploadTrigger>
                  <FileUploadList showSize clearable />
                </FileUploadRoot>
              </div>
              <div>
                {fileList?.map((file) => (
                  <HStack key={file.fileName}>
                    <Image
                      src={file.filePath}
                      border={"1px solid black"}
                      m={3}
                    />
                    <CloseButton
                      variant="solid"
                      onClick={() => handleDeleteFileClick(file)}
                    />
                  </HStack>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      )}

      {hasAccessByNickName(community.writer) || (
        <div>
          <Alert status="warning" title="접근 권한이 없습니다." />
          <CommunityList />
        </div>
      )}
    </div>
  );
}

export default CommunityEdit;
