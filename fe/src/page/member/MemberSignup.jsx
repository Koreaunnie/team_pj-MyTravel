import React, { useState } from "react";
import { toaster } from "../../components/ui/toaster.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  return (
    <div>
      <h1>회원 가입</h1>

      <form>
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
            <li>
              <label htmlFor="email">이메일</label>
              <input
                placeholder={"30자 이내"}
                id={"email"}
                type="search"
                maxlength="30"
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
            <li>
              <label htmlFor="nickanem">
                <input
                  placeholder={"20자 이내"}
                  className={"nickname"}
                  type="search"
                  maxlength="20"
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
                  variant={"outline"}
                >
                  중복 확인
                </button>
              </label>
            </li>
            <li>
              <label htmlFor="password">비밀번호</label>
              <input
                placeholder={"30자 이내"}
                maxlength="30"
                id={"password"}
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </li>
            <li>
              <label htmlFor="password-check">비밀번호</label>
              <input
                placeholder={"비밀번호를 다시 한 번 입력해주세요."}
                maxlength="30"
                id={"password-check"}
                type="text"
                required
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
              />
            </li>
            <li>
              <label htmlFor="name">이름</label>
              <input
                placeholder={"20자 이내"}
                maxlength="20"
                id={"name"}
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </li>
            <li>
              <label htmlFor="phone">전화번호</label>
              <input
                placeholder={"숫자만 입력해주세요."}
                maxlength="20"
                id={"phone"}
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
      </form>

      <div className={"btn-wrap"}>
        <button
          className={"btn btn-dark"}
          onClick={handleSignupClick}
          disabled={disabled}
        >
          가입
        </button>
      </div>
    </div>
  );
}

export default MemberSignup;
