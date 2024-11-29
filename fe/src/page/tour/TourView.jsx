import React, { useEffect, useState } from "react";
import { Box, Input, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "../../components/ui/button.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";
import { ImageFileView } from "../../Image/ImageFileView.jsx";

function TourView() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/tour/view/${id}`).then((res) => setTour(res.data));
  }, []);

  if (tour === null) {
    return <p>존재하지 않는 상품 정보입니다.</p>;
  }

  const handleDeleteClick = () => {
    axios
      .delete(`/api/tour/delete/${tour.id}`)
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.msg.type,
          description: data.msg.text,
        });
        navigate("/tour/list");
      })
      .catch((e) => {
        const data = e.response.data;
        toaster.create({
          type: data.msg.type,
          description: data.msg.text,
        });
      });
  };

  return (
    <Box>
      <h1>{tour.title}</h1>
      <Stack>
        <Field label={"상품"} readOnly>
          <Input value={tour.product} />
        </Field>
        <ImageFileView files={tour.fileList} />
        <Field label={"위치"} readOnly>
          <Input value={tour.location} />
        </Field>
        <Field label={"가격"} readOnly>
          <Input value={tour.price} />
        </Field>
        <Field label={"내용"} readOnly>
          <Textarea value={tour.content} />
        </Field>
        <Field label={"제공사"} readOnly>
          <Input value={tour.partner} />
        </Field>
        <Box>
          <Button onClick={() => navigate(`/tour/update/${id}`)}>수정</Button>
          <DialogRoot>
            <DialogTrigger>
              <Button>삭제</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>삭제 확인</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <p>{tour.title} 게시물을 삭제하시겠습니까?</p>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger>
                  <Button>취소</Button>
                </DialogActionTrigger>
                <Button onClick={handleDeleteClick}>삭제</Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </Box>
      </Stack>
    </Box>
  );
}

export default TourView;
