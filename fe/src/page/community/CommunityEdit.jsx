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

function ImageFileView({ files }) {
  return (
    <Box>
      {files?.map((file) => (
        <Image
          key={file.fileName}
          src={file.filePath}
          border={"1px solid black"}
          m={3}
        />
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
            <Button>취소</Button>
            <Button onClick={handleSaveClick}>저장</Button>
          </HStack>
        </Box>
      </Box>
    </div>
  );
}

export default CommunityEdit;
