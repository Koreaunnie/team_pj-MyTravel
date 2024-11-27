import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, HStack, Input, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";

function CommunityView(props) {
  const { id } = useParams();
  const [community, setCommunity] = useState({});

  useEffect(() => {
    axios
      .get(`/community/view/${id}`, { id })
      .then((e) => setCommunity(e.data));
  }, []);

  const handleDeleteClick = () => {
    axios.delete(`/community/delete/${id}`);
  };

  const handleEditClick = () => {
    axios.post(`/community/edit`);
  };
  return (
    <div>
      <h1>{id}번 게시물</h1>
      <Box>
        <Field label={"제목"}>
          <Input value={community.title} readOnly />
        </Field>
        <Field label={"본문"}>
          <Textarea value={community.content} readOnly />
        </Field>
        <Field label={"작성자"}>
          <Input value={community.writer} readOnly />
        </Field>
        <Field label={"작성일시"}>
          <Input value={community.creationDate} readOnly />
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
