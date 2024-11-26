import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, HStack, Input, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";

function CommunityView(props) {
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/community/view/${id}`);
  }, []);

  const handleDeleteClick = () => {
    axios.delete(`/community/delete/${id}`);
  };
  return (
    <div>
      <Box>
        <Field label={"제목"}>
          <Input readOnly />
        </Field>
        <Field label={"본문"}>
          <Textarea readOnly />
        </Field>
        <Filed label={"작성자"}>
          <Input readOnly />
        </Filed>
        <Field label={"작성일시"}>
          <Input readOnly />
        </Field>
      </Box>
      <Box>
        <HStack>
          <Button onClick={handleDeleteClick}>삭제</Button>
          <Button onClick={handleEditClick}>수정</Button>
        </HStack>
      </Box>
    </div>
  );
}

export default CommunityView;
