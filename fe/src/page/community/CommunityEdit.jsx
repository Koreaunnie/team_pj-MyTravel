import React, { useContext, useEffect, useState } from "react";
import { Box, HStack, Image, Input, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
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
    <div>
      {hasAccessByNickName(community.writer) && (
        <div>
          <Breadcrumb
            depth1={"커뮤니티"}
            navigateToDepth1={() => navigate(`/community/list`)}
            depth2={"게시글 수정"}
            navigateToDepth2={() => navigate(`/community/edit/${id}`)}
          />
          <br />
          <br />
          <Box>
            <h1>게시글 수정</h1>
            <Box
              mx={"auto"}
              w={{
                md: "500px",
              }}
            >
              <Field label={"제목"}>
                <Input
                  value={community.title}
                  onChange={(e) =>
                    setCommunity({ ...community, title: e.target.value })
                  }
                />
              </Field>
              <Field label={"본문"}>
                <Textarea
                  value={community.content}
                  onChange={(e) =>
                    setCommunity({ ...community, content: e.target.value })
                  }
                  h={300}
                />
              </Field>
              <Field>
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
        </div>
      )}
      {hasAccessByNickName(community.writer) || (
        <Box>
          <br />
          <br />
          <Alert status="warning" title="접근 권한이 없습니다." />
          <CommunityList />
        </Box>
      )}
    </div>
  );
}

export default CommunityEdit;
