import React, { useState } from "react";
import { Box, HStack, Input, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";

function CommunityEdit(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSaveClick = () => {
    axios
      .put(`/api/community/edit`, { title, content })
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
            <Button>취소</Button>
            <Button onClick={handleSaveClick}>저장</Button>
          </HStack>
        </Box>
      </Box>
    </div>
  );
}

export default CommunityEdit;
