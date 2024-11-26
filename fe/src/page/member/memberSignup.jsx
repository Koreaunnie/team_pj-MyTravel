import React, { useState } from "react";
import { Box, Field, Input, Stack } from "@chakra-ui/react";
import { Button } from "../../components/ui/button.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import axios from "axios";

function MemberSignup(props) {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

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
          description: message.txt,
        });
      })
      .finally(() => {
        console.log("무조건 실행: 아마 경로 이동");
      });
  }

  return (
    <Box>
      <h3>회원 가입</h3>
      <Stack>
        <Field label={"이메일"}>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
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
        <Field label={"이름"}>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label={"전화번호"}>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>

        <Box>
          <Button onClick={handleSignupClick}>가입</Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default MemberSignup;
