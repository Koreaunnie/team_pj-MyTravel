import React, { useEffect, useState } from "react";
import { Box, HStack, Image, Input, Stack, Textarea } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
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
import { toaster } from "../../components/ui/toaster.jsx";
import { Checkbox } from "../../components/ui/checkbox.jsx";

function ImageView({ files, onRemoveCheckClick }) {
  return (
    <Box>
      {files.map((file) => (
        <HStack key={file.name}>
          <Checkbox
            onCheckedChange={(e) => onRemoveCheckClick(e.checked, file.name)}
          />
          <Image src={file.src} m={5}></Image>
        </HStack>
      ))}
    </Box>
  );
}

function TourUpdate() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [open, setOpen] = useState(false);
  const [removeFiles, setRemoveFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/tour/view/${id}`).then((res) => setTour(res.data));
  }, []);

  const handleDeleteCheck = (checked, fileName) => {
    if (checked) {
      setRemoveFiles([...removeFiles, fileName]);
    } else {
      setRemoveFiles(removeFiles.filter((f) => f !== fileName));
    }
    console.log("삭제할 파일: ", removeFiles);
  };

  const handleSaveClick = () => {
    axios
      .putForm(`/api/tour/update`, {
        id: tour.id,
        title: tour.title,
        product: tour.product,
        location: tour.location,
        content: tour.content,
        removeFiles,
      })
      .then((res) => {
        const message = res.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate(`/tour/view/${id}`);
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        setOpen(false);
      });
  };

  if (tour === null) {
    return <p>존재하지 않는 상품입니다.</p>;
  }

  return (
    <Box>
      <h1>{id}번 상품 수정</h1>
      <Stack>
        <Field label={"제목"}>
          <Input
            value={tour.title}
            onChange={(e) => setTour({ ...tour, title: e.target.value })}
          />
        </Field>
        <ImageView
          files={tour.fileList}
          onRemoveCheckClick={handleDeleteCheck}
        />
        <Field label={"상품"}>
          <Input
            value={tour.product}
            onChange={(e) => setTour({ ...tour, product: e.target.value })}
          />
        </Field>
        <Field label={"위치"}>
          <Input
            value={tour.location}
            onChange={(e) => setTour({ ...tour, location: e.target.value })}
          />
        </Field>
        <Field label={"가격"}>
          <Input
            value={tour.price}
            onChange={(e) => setTour({ ...tour, price: e.target.value })}
          />
        </Field>
        <Field label={"내용"}>
          <Textarea
            value={tour.content}
            onChange={(e) => setTour({ ...tour, content: e.target.value })}
          />
        </Field>
        <Box>
          <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
            <DialogTrigger>
              <Button>저장</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>수정 확인</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <p>{tour.title} 상품의 수정 내용을 저장하시겠습니까?</p>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger>
                  <Button>취소</Button>
                </DialogActionTrigger>
                <Button onClick={handleSaveClick}>저장</Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </Box>
      </Stack>
    </Box>
  );
}

export default TourUpdate;
