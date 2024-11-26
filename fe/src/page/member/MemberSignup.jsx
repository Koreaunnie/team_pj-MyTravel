import React, { useState } from "react";
import { Box, Group, Input, Stack } from "@chakra-ui/react";
import { Button } from "../../components/ui/button.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import axios from "axios";
import { Field } from "../../components/ui/field.jsx";

function MemberSignup(props) {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emailCheck, setEmailCheck] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState("");

  function handleSignupClick() {
    axios
      .post("/api/member/signup", { email, nickname, password, name, phone })
      .then((res) => {
        console.log("가입 성공");
        const message = res.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .catch((e) => {
        console.log("가입 실패");
        const message = e.response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        console.log("무조건 실행: 아마 경로 이동");
      });
  }

  const handleEmailCheckClick = () => {
    axios
      .get("/api/member/checkEmail", {
        params: { email: email },
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        setEmailCheck(data.available);
      });
  };

  let disabled = true;

  if (emailCheck) {
    if (password === passwordCheck) {
      disabled = false;
    }
  }

  return (
    <Box>
      <h1>회원 가입</h1>
      <Stack>
        <Field label={"이메일"}>
          <Group attached w={"100%"}>
            <Input
              value={email}
              onChange={(e) => {
                setEmailCheck(false);
                setEmail(e.target.value);
              }}
            />
            <Button onClick={handleEmailCheckClick} variant={"outline"}>
              중복 확인
            </Button>
          </Group>
        </Field>
        <Field label={"닉네임"}>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </Field>
        <Field label={"비밀번호"}>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field label={"비밀번호 확인"}>
          <Input
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </Field>
        <Field label={"이름"}>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label={"전화번호"}>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>

        <Box>
          <Button onClick={handleSignupClick} disabled={disabled}>
            가입
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default MemberSignup;
