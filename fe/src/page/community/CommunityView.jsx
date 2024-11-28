import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, HStack, Input, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";

function CommunityView(props) {
  const { id } = useParams();
  const [community, setCommunity] = useState({});

  useEffect(() => {
    axios
      .get(`/api/community/view/${id}`, { id })
      .then((e) => setCommunity(e.data));
  }, []);

  const handleDeleteClick = () => {
    axios.delete(`/api/community/delete/${id}`);
  };

  const handleEditClick = () => {
    axios.post(`/api/community/edit`);
  };
  return (
    <div>
      <h1>{id}번 게시물</h1>
      <Stack>
        <Box>
          <Field label={"제목"} readOnly>
            <Input value={community.title} />
          </Field>
          <Field label={"본문"} readOnly>
            <Textarea value={community.content} />
          </Field>
          <Field label={"작성자"} readOnly>
            <Input value={community.writer} />
          </Field>
          <Field label={"작성일시"} readOnly>
            <Input value={community.creationDate} />
          </Field>
        </Box>
        <Box>
          <HStack>
            <Button onClick={handleDeleteClick}>삭제</Button>
            <Button onClick={handleEditClick}>수정</Button>
          </HStack>
        </Box>
      </Stack>
    </div>
  );
}

export default CommunityView;
