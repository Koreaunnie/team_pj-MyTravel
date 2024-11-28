import React, { useEffect, useState } from "react";
import { Box, Group, Input, Spinner, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
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

export function MemberEdit() {
  const [member, setMember] = useState(null);
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [nicknameCheck, setNicknameCheck] = useState(true);
  const [open, setOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState("");

  const { email } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/member/${email}`).then((res) => {
      setMember(res.data);
      setNickname(res.data.nickname);
      setPassword(res.data.password);
      setPhone(res.data.phone);
    });
  }, []);

  function handleSaveClick() {
    axios
      .putForm(`/api/member/update`, {
        email: member.email,
        nickname,
        password,
        oldPassword,
        phone,
        uploadFiles,
      })
      .then((res) => {
        const message = res.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate(`/member/${email}`);
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
        setOldPassword("");
      });
  }

  const handleNicknameCheckClick = () => {
    axios
      .get(`/api/member/check`, {
        params: { nickname },
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        setNicknameCheck(data.available);
      });
  };

  const nicknameCheckButtonDisabled = nickname === member?.nickname;
  const saveButtonDisabled = !nicknameCheck;

  if (!member) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>회원 정보 수정</h1>
      <Stack>
        <Box>
          <Input
            onChange={(e) => setUploadFiles(e.target.files[0])}
            type={"file"}
            accept={"image/*"}
          />
        </Box>
        <Field label={"이메일"} readOnly>
          <Input defaultValue={member.email} />
        </Field>
        <Field label={"닉네임"}>
          <Group attached w={"100%"}>
            <Input
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (e.target.value === member.nickname) {
                  setNicknameCheck(true);
                } else {
                  setNicknameCheck(false);
                }
              }}
            />
            <Button
              onClick={handleNicknameCheckClick}
              disabled={nicknameCheckButtonDisabled}
            >
              중복 확인
            </Button>
          </Group>
        </Field>
        <Field label={"비밀번호"}>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field label={"이름"} readOnly>
          <Input defaultValue={member.name} />
        </Field>
        <Field label={"전화번호"}>
          <Input defaultValue={member.phone} />
        </Field>
        <Box>
          <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
            <DialogTrigger>
              <Button disabled={saveButtonDisabled}>저장</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>회원 정보 변경</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <Stack>
                  <Field>
                    <Input
                      placeholder={"기존 비밀번호 입력"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </Field>
                </Stack>
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
