import React, { useContext, useState } from "react";
import { Box, Input } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";

function MemberLogin(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthenticationContext);

  function handleLoginClick() {
    axios
      .post(`/api/member/login`, { email, password })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate("/");
        login(data.token);
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally();
  }

  return (
    <div className={"body"}>
      <h1>로그인</h1>
      <ul className={"title"}>
        <li>
          <label htmlFor="email">이메일</label>
          <input
            type={"text"}
            id={"email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </li>
        <li>
          <label htmlFor="password">비밀번호</label>
          <Input
            type={"password"}
            id={"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </li>
      </ul>
      <Box>
        <button className={"btn btn-dark"} onClick={handleLoginClick}>
          로그인
        </button>
      </Box>
    </div>
  );
}

export default MemberLogin;
