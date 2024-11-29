import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Box, HStack, Input, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";

function CommunityView(props) {
  const { id } = useParams();
  const [community, setCommunity] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/community/view/${id}`, { id })
      .then((e) => setCommunity(e.data));
  }, []);

  const handleDeleteClick = () => {
    axios
      .delete(`/api/community/delete/${id}`)
      .then(navigate(`/community/list`));
  };

  const handleEditClick = () => {
    navigate(`/community/edit/${id}`);
    ///community/edit/18
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
            <DialogRoot>
              <DialogTrigger>
                <Button>삭제</Button>
                <DialogContent>
                  <DialogHeader>글 삭제</DialogHeader>
                  <DialogBody>{id}번 게시물을 삭제하시겠습니까?</DialogBody>
                  <DialogFooter>
                    <Button>취소</Button>
                    <DialogActionTrigger>
                      <Button onClick={handleDeleteClick}>삭제</Button>
                    </DialogActionTrigger>
                  </DialogFooter>
                </DialogContent>
              </DialogTrigger>
            </DialogRoot>
            <Button onClick={handleEditClick}>수정</Button>
          </HStack>
        </Box>
      </Stack>
    </div>
  );
}

export default CommunityView;
