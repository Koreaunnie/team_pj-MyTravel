import React, { useContext, useEffect, useState } from "react";
import { Box, Input, Stack, Textarea } from "@chakra-ui/react";
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
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import { ImageView } from "../../components/Image/ImageView.jsx";

function TourUpdate() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [open, setOpen] = useState(false);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const { userToken, hasAccess, isAdmin, isPartner } = useContext(
    AuthenticationContext,
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (tour !== null && !(hasAccess(tour.partnerEmail) || isAdmin)) {
      toaster.create({
        type: "error",
        description: "접근 권한이 없습니다.",
      });
      navigate("/", { replace: true });
    }
  }, [tour, hasAccess, isAdmin, navigate]);

  useEffect(() => {
    axios.get(`/api/tour/view/${id}`).then((res) => {
      setTour(res.data);
    });
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
        price: tour.price,
        content: tour.content,
        removeFiles,
        uploadFiles,
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

  const handleCancelClick = () => {
    navigate(`/tour/view/${id}`);
  };

  const uploadFilesList = [];
  let sumOfUploadFileSize = 0;
  let invalidOneFileSize = false;
  for (const file of uploadFiles) {
    sumOfUploadFileSize += file.size;
    if (file.size > 1024 * 1024) {
      invalidOneFileSize = true;
    }
    uploadFilesList.push(
      <li style={{ color: file.size > 1024 * 1024 ? "red" : "black" }}>
        {file.name} ({Math.floor(file.size / 1024)}kb)
      </li>,
    );
  }

  let fileInputInvalid = false;
  if (sumOfUploadFileSize > 10 * 1024 * 1024 || invalidOneFileSize) {
    fileInputInvalid = true;
  }

  if (tour === null) {
    return <p>존재하지 않는 상품입니다.</p>;
  }

  return (
    <div className={"tour"}>
      <Breadcrumb
        depth1={"투어"}
        navigateToDepth1={() => navigate(`/tour/list`)}
        depth2={"상품 수정"}
        navigateToDepth2={() => navigate(`/tour/update/${id}`)}
      />
      <h1>{id}번 Tour 상품 수정</h1>
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
        <Box>
          <Field
            label={"파일"}
            helperText={
              "총 10MB, 한 파일은 1MB 이내의 이미지만 업로드 가능합니다."
            }
            invalid={fileInputInvalid}
            errorText={"선택한 파일이 업로드 가능한 용량을 초과하였습니다."}
          >
            <Input
              onChange={(e) => setUploadFiles(e.target.files)}
              type={"file"}
              accept={"image/*"}
              multiple
            />
          </Field>
        </Box>
        <Box>
          <Box>{uploadFilesList}</Box>
        </Box>
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

        {(hasAccess(tour.partnerEmail) || isAdmin) && (
          <Box>
            <button
              className={"btn btn-dark-outline"}
              onClick={handleCancelClick}
            >
              취소
            </button>
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
        )}
      </Stack>
    </div>
  );
}

export default TourUpdate;
