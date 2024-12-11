import React, { useState } from "react";
import { toaster } from "../../components/ui/toaster.jsx";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Member.css";

function MemberSignupKakao() {
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emailCheck, setEmailCheck] = useState(false);
  const [nicknameCheck, setNicknameCheck] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { kakaoId, kakaoNickname, kakaoImageSrc } = location.state || {};
  const [files, setFiles] = useState([kakaoImageSrc]);

  function handleKakaoSignupClick() {
    axios
      .postForm("/api/member/signup/kakao", {
        email: kakaoId,
        nickname,
        name,
        phone,
        files,
      })
      .then((res) => {})
      .catch((e) => {});
  }

  const handleKakaoNicknameCheckClick = () => {
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
      disabled = false;
    }
  }

  return (
    <div className={"body-narrow"}>
      <h1>카카오 회원 가입</h1>

      <form className={"member-form"}>
        <fieldset>
          <ul>
            <li>
              <img src={kakaoImageSrc} alt="프로필 사진" />
              <label>프로필 사진</label>
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
                onClick={handleKakaoNicknameCheckClick}
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
                value={kakaoNickname}
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
      </form>
    </div>
  );
}

export default MemberSignupKakao;
