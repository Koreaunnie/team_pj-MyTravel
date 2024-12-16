import React, { useState } from "react";
import { toaster } from "../../components/ui/toaster.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Member.css";

function MemberSignup(props) {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [files, setFiles] = useState([]);
  const [emailCheck, setEmailCheck] = useState(false);
  const [nicknameCheck, setNicknameCheck] = useState(true);
  const [passwordCheck, setPasswordCheck] = useState("");
  const navigate = useNavigate();

  function handleSignupClick() {
    axios
      .postForm("/api/member/signup", {
        email,
        nickname,
        password,
        name,
        phone,
        files,
      })
      .then((res) => {
        const message = res.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate(`/member/login`);
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      });
  }

  const handleEmailCheckClick = () => {
    axios
      .get("/api/member/check", {
        params: { email },
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

  let nicknameCheckButtonDisabled = nickname.length === 0;

  let disabled = true;

  if (emailCheck) {
    if (nicknameCheck && nickname != "") {
      if (password === passwordCheck) {
        disabled = false;
      }
    }
  }

  const filesList = [];
  for (const file of files) {
    filesList.push(<li>{file.name}</li>);
  }

  let passwordInvalid = false;
  if (password != passwordCheck) {
    passwordInvalid = true;
  }

  return (
    <div className={"body-narrow"}>
      <h1>회원 가입</h1>

      <form className={"member-form"}>
        <fieldset>
          <ul>
            <li>
              <label htmlFor="">프로필 사진</label>
              <input
                onChange={(e) => setFiles(e.target.files)}
                type={"file"}
                accept={"image/*"}
                multiple
              />
              {filesList}
            </li>
            <li className={"check-form"}>
              <label htmlFor="email">
                이메일
                <span className={"required"}>&#42;</span>
              </label>

              <input
                placeholder={"중복 확인을 해주세요."}
                id={"email"}
                type="email"
                maxLength="30"
                required
                value={email}
                onChange={(e) => {
                  setEmailCheck(false);
                  setEmail(e.target.value);
                }}
              />
              <button
                className={"btn-search btn-dark"}
                onClick={handleEmailCheckClick}
              >
                중복 확인
              </button>
            </li>

            <li className={"check-form"}>
              <label htmlFor="nickname">
                닉네임
                <span className={"required"}>&#42;</span>
              </label>

              <input
                placeholder={"중복 확인을 해주세요."}
                id={"nickname"}
                type={"text"}
                maxLength="20"
                required
                value={nickname}
                onChange={(e) => {
                  setNicknameCheck(false);
                  setNickname(e.target.value);
                }}
              />
              <button
                className={"btn-search btn-dark"}
                onClick={handleNicknameCheckClick}
                disabled={nicknameCheckButtonDisabled}
              >
                중복 확인
              </button>
            </li>

            <li>
              <label htmlFor="password">
                비밀번호
                <span className={"required"}>&#42;</span>
              </label>
              <input
                placeholder={"30자 이내"}
                maxLength="30"
                id={"password"}
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </li>

            <li>
              <label htmlFor="password-check">
                비밀번호 확인
                <span className={"required"}>&#42;</span>
              </label>
              <input
                placeholder={"비밀번호를 다시 한 번 입력해주세요."}
                maxLength="30"
                id={"password-check"}
                type="password"
                required
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
              />
              {/* 비밀번호가 일치하지 않을 경우 에러 메시지 표시 */}
              {password && passwordCheck && password !== passwordCheck && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
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
                value={name}
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
            onClick={handleSignupClick}
            disabled={disabled}
          >
            가입
          </button>
        </div>

        <div className={"move-to-button"}>
          <p>이미 가입을 하셨나요?</p>
          <p className={"link"} onClick={() => navigate(`/member/login`)}>
            로그인
          </p>
        </div>
      </form>
    </div>
  );
}

export default MemberSignup;
