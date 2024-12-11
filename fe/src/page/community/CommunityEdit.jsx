import React, { useEffect, useState } from "react";
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

function ImageFileView({ files }) {
  function handleDeleteFileClick(file) {}

  return (
    <Box>
      {files?.map((file) => (
        <HStack key={file.fileName}>
          <Image src={file.filePath} border={"1px solid black"} m={3} />
          <CloseButton onClick={() => handleDeleteFileClick(file)} />
        </HStack>
      ))}
    </Box>
  );
}

function CommunityEdit(props) {
  const [community, setCommunity] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios.get(`/api/community/view/${id}`).then((res) => {
      setCommunity(res.data);
      setFiles(res.data);
    });
  }, []);

  const handleSaveClick = () => {
    axios
      .putForm(`/api/community/edit`, {
        id: community.id,
        title: community.title,
        content: community.content,
        communityFileList: community.communityFileList,
        // creationDate: community.creationDate.toString().substring(0, 19),
      })
      .then(navigate(`/community/list`));
  };

  console.log(community);
  const handleCancelClick = () => {
    navigate(`/community/view/${community.id}`);
  };

  return (
    <div>
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
        <ImageFileView files={community.files} />
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
    </div>
  );
}

export default CommunityEdit;
