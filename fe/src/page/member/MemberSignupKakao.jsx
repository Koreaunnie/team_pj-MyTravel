import React, { useContext, useState } from "react";
import { toaster } from "../../components/ui/toaster.jsx";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Member.css";
import { Box, Image } from "@chakra-ui/react";
import randomString from "../../components/login/RandomString.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";

function MemberSignupKakao() {
  const [phone, setPhone] = useState("");
  const [nicknameCheck, setNicknameCheck] = useState(true);
  const navigate = useNavigate();
  const password = randomString();
  const location = useLocation();
  const { kakaoId, kakaoNickname, kakaoImageSrc } = location.state || {};
  const [nickname, setNickname] = useState(kakaoNickname);
  const [name, setName] = useState(kakaoNickname);
  const [files, setFiles] = useState([]);
  const { login } = useContext(AuthenticationContext);

  function handleKakaoSignupClick() {
    axios
      .postForm("/api/member/signup/kakao", {
        email: kakaoId,
        nickname,
        password,
        name,
        phone,
        files,
        kakaoImageSrc,
      })
      .then((res) => res.data)
      .then((data) => {
        //로그인 처리
        console.log("사용자 데이터", data);
        login(data.token);
        navigate("/");
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      });
  }

  const handleKakaoNicknameCheck = () => {
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

  let nicknameCheckButtonDisabled = nickname == null;

  let disabled = true;

  if (nicknameCheck && nickname != "") {
    disabled = false;
  }

  return (
    <div className={"body-narrow"}>
      <h1>카카오 회원 가입</h1>

      <div className={"member-form"}>
        <fieldset>
          <ul>
            <li>
              <Box display={"flex"} justifyContent={"center"}>
                <Image
                  src={kakaoImageSrc}
                  alt="프로필 사진"
                  borderRadius="50%"
                  boxSize="200px"
                />
              </Box>
              <label>프로필 사진 변경</label>
              <input
                type={"file"}
                onChange={(e) => setFiles(e.target.files)}
                accept={"image/*"}
              />
            </li>

            <li className={"check-form"}>
              <label htmlFor="nickname">
                닉네임
                <span className={"required"}>&#42;</span>
              </label>
              <input
                id={"nickname"}
                type={"text"}
                maxLength="20"
                required
                defaultValue={kakaoNickname}
                onChange={(e) => {
                  setNicknameCheck(false);
                  setNickname(e.target.value);
                }}
              />
              <button
                className={"btn-search btn-dark"}
                onClick={handleKakaoNicknameCheck}
                disabled={nicknameCheckButtonDisabled}
              >
                중복 확인
              </button>
            </li>

            <li>
              <label htmlFor="name">
                이름
                <span className={"required"}>&#42;</span>
              </label>
              <input
                placeholder={"20자 이내"}
                maxLength="20"
                id={"name"}
                type="text"
                required
                defaultValue={kakaoNickname}
                onChange={(e) => setName(e.target.value)}
              />
            </li>
            <li>
              <label htmlFor="phone">
                전화번호
                <span className={"required"}>&#42;</span>
              </label>
              <input
                placeholder={"숫자만 입력해주세요."}
                maxLength="20"
                id={"phone"}
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>

        <div className={"btn-wrap"}>
          <button
            className={"btn-wide btn-dark"}
            onClick={handleKakaoSignupClick}
            disabled={disabled}
          >
            가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemberSignupKakao;
