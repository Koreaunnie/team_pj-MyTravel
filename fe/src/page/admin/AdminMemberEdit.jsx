import React, { useEffect, useState } from "react";
import { Box, Center, Group, Input, Spinner, Stack } from "@chakra-ui/react";
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
import { ProfileImageView } from "../../components/Image/ProfileImageView.jsx";
import randomString from "../../components/login/RandomString.jsx";
import "/src/page/member/Member.css";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "../../components/ui/file-button.jsx";
import { HiUpload } from "react-icons/hi";

export function AdminMemberEdit() {
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
      setPhone(res.data.phone);

      if (res.data.kakao) {
        //kakao 계정이라면 랜덤 비밀번호 생성 및 설정
        const newPassword = randomString();
        setPassword(newPassword);
      } else {
        setPassword(res.data.password);
      }
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
    <div className={"member-edit"}>
      <h1>회원 정보 수정</h1>

      <ProfileImageView files={member.profile} />

      <div className={"form-wrap body-normal"}>
        <fieldset>
          <ul>
            <li style={{ marginBottom: "20px" }}>
              <FileUploadRoot
                onChange={(e) => setUploadFiles(e.target.files[0])}
              >
                <FileUploadTrigger asChild>
                  <Button variant="outline" size="sm">
                    <HiUpload /> 프로필 사진 업로드
                  </Button>
                </FileUploadTrigger>
                <FileUploadList showSize clearable />
              </FileUploadRoot>
            </li>

            {member.kakao || (
              <li>
                <label htmlFor="email">이메일</label>
                <input type={"text"} id={email} value={member.email} readOnly />
                <span>이메일은 수정이 불가합니다.</span>
              </li>
            )}

            <li>
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
            </li>

            {member.kakao || (
              <li>
                <label htmlFor="password">비밀번호</label>
                <input
                  type={"password"}
                  id={"password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </li>
            )}

            <li>
              <label htmlFor="name">이름</label>
              <input type={"text"} id={"name"} value={member.name} />
              <span>
                이름은 수정이 불가합니다. 수정을 원하시면 문의게시판에
                남겨주세요.
              </span>
            </li>

            <li>
              <Field label={"전화번호"}>
                <Input defaultValue={member.phone} />
              </Field>
            </li>
          </ul>
        </fieldset>
      </div>

      <Stack>
        <Center>
          <button
            className={"btn btn-dark-outline"}
            onClick={() => navigate(`/member/${email}`)}
          >
            취소
          </button>

          {member.kakao || (
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
          )}

          {member.kakao && (
            <Box>
              <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
                <DialogTrigger>
                  <Button disabled={saveButtonDisabled}>저장</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>회원 정보 변경 확인</DialogTitle>
                  </DialogHeader>
                  <DialogBody>
                    <Stack>
                      <p>
                        수정을 확인하려면 텍스트 입력 필드에 {member.password}을
                        따라 입력해 주십시오
                      </p>
                      <Field>
                        <Input
                          placeholder={member.password}
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
          )}
        </Center>
      </Stack>
    </div>
  );
}
