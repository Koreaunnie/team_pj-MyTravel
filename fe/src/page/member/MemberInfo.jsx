import React, { useEffect, useState } from "react";
import { Box, Input, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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
import { ProfileImageView } from "../../Image/ProfileImageView.jsx";

function MemberInfo(props) {
  const [member, setMember] = useState(null);
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const { email } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/member/${email}`).then((res) => setMember(res.data));
  }, []);

  if (!member) {
    return <p>존재하지 않는 계정입니다.</p>;
  }

  function handleDeleteClick() {
    axios
      .delete(`/api/member/remove`, {
        data: { email, password },
      })
      .then((res) => {
        const message = res.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        localStorage.removeItem("token");
        navigate(`/member/signup`);
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
        setPassword("");
      });
  }

  return (
    <Box>
      <h1>회원 정보</h1>
      <Stack>
        <ProfileImageView files={member.profile} />
        {member.kakao || (
          <Field label={"이메일"}>
            <Input readOnly value={member.email} />
          </Field>
        )}
        <Field label={"닉네임"}>
          <Input readOnly value={member.nickname} />
        </Field>
        {member.kakao || (
          <Field label={"비밀번호"}>
            <Input readOnly value={member.password} />
          </Field>
        )}
        <Field label={"이름"}>
          <Input readOnly value={member.name} />
        </Field>
        <Field label={"전화번호"}>
          <Input readOnly value={member.phone} />
        </Field>
        {member.kakao && (
          <Field label={"연동 계정"}>
            <Input readonly value={"카카오톡"} />
          </Field>
        )}
        <Field label={"가입 일시"}>
          <Input type={"datetime-local"} readOnly value={member.inserted} />
        </Field>
        <Box>
          <button
            className={"btn btn-dark"}
            onClick={() => navigate(`/member/edit/${email}`)}
          >
            수정
          </button>
          {member.kakao || (
            <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
              <DialogTrigger>
                <button className={"btn btn-warning"}>탈퇴</button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>탈퇴 확인</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <Stack>
                    <Field label={"비밀번호"}>
                      <Input
                        placeholder={"비밀번호 입력"}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                    </Field>
                  </Stack>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger>
                    <Button variant={"outline"}>취소</Button>
                  </DialogActionTrigger>
                  <Button onClick={handleDeleteClick}>탈퇴</Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          )}{" "}
          {member.kakao && (
            <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
              <DialogTrigger>
                <button className={"btn btn-warning"}>탈퇴</button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>탈퇴 확인</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <Stack>
                    <p>
                      회원 정보 삭제를 확인하려면 텍스트 입력 필드에{" "}
                      {member.password}을 따라 입력해 주십시오
                    </p>
                    <Field>
                      <Input
                        placeholder={member.password}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                    </Field>
                  </Stack>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger>
                    <Button variant={"outline"}>취소</Button>
                  </DialogActionTrigger>
                  <Button onClick={handleDeleteClick}>탈퇴</Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default MemberInfo;
