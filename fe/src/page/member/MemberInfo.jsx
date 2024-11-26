import React, { useEffect, useState } from "react";
import { Box, Input, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import axios from "axios";
import { useParams } from "react-router-dom";

function MemberInfo(props) {
  const [member, setMember] = useState(null);
  const { email } = useParams();

  useEffect(() => {
    axios.get(`/api/member/${email}`).then((res) => setMember(res.data));
  }, []);

  if (!member) {
    return <p>존재하지 않는 계정입니다.</p>;
  }

  return (
    <Box>
      <h1>회원 정보</h1>
      <Stack>
        <Field label={"이메일"}>
          <Input readOnly value={member.email} />
        </Field>
        <Field label={"닉네임"}>
          <Input readOnly value={member.nickname} />
        </Field>
        <Field label={"비밀번호"}>
          <Input readOnly value={member.password} />
        </Field>
        <Field label={"이름"}>
          <Input readOnly value={member.name} />
        </Field>
        <Field label={"전화번호"}>
          <Input readOnly value={member.phone} />
        </Field>
        <Field label={"가입 일시"}>
          <Input type={"datetime-local"} readOnly value={member.inserted} />
        </Field>
      </Stack>
    </Box>
  );
}

export default MemberInfo;
