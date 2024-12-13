import React, { useContext, useState } from "react";
import { Input } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import SocialKakao from "../../components/login/SocialKakao.jsx";

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
    <div className={"body-narrow"}>
      <h1>로그인</h1>

      <div className={"member-form"}>
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

        <button className={"btn-wide btn-dark"} onClick={handleLoginClick}>
          로그인
        </button>
        <SocialKakao />
        <div className={"move-to-button"}>
          <p>가입하고 더 많은 여행을 함께 하시겠어요?</p>
          <p className={"link"} onClick={() => navigate(`/member/signup`)}>
            회원가입
          </p>
        </div>
      </div>
    </div>
  );
}

export default MemberLogin;
