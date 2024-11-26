import React, { useEffect } from "react";
import axios from "axios";
import { Box, HStack, Input, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";

function CommunityWrite(props) {
  useEffect(() => {
    axios.put(`/community/write`, { title, content });
  }, []);

  const handleSaveClick = () => {};

  return (
    <div>
      <Box>
        <Field label={"제목"}>
          <Input />
        </Field>
        <Field label={"본문"}>
          <Textarea />
        </Field>
      </Box>
      <Box>
        <HStack>
          <Button>취소</Button>
          <Button onClick={handleSaveClick}>저장</Button>
        </HStack>
      </Box>
    </div>
  );
}
