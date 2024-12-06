import React, { useState } from "react";
import { Breadcrumb } from "/src/components/root/Breadcrumb.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function InquiryAdd(props) {
  const [category, setCategory] = useState("plan");
  const [writer, setWriter] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // const [files, setFiles] = useState(null);
  const [secret, setSecret] = useState(false);

  const navigate = useNavigate();

  const handleSaveButton = () => {
    axios
      .post("/api/cs/inquiry/add", {
        category,
        writer,
        title,
        content,
        secret,
      })
      .then((res) => {
        res.data;
        console.log(title);
      })
      .catch()
      .finally();
  };

  return (
    <div className={"cs"}>
      <Breadcrumb
        depth1={"고객센터"}
        navigateToDepth1={() => navigate(`/cs`)}
        depth2={"문의하기"}
        navigateToDepth2={() => navigate(`/cs/inquiry`)}
        depth3={"문의글 작성"}
        navigateToDepth3={() => navigate(`/cs/inquiry/add`)}
      />

      <div className={"body-normal"}>
        <div>
          <fieldset>
            <ul>
              <li>
                <label htmlFor="category">문의 유형</label>
                <select id="category" value={category}>
                  <option value="plan">내 여행 문의</option>
                  <option value="wallet">내 지갑 문의</option>
                  <option value="tour">투어 문의</option>
                  <option value="community">커뮤니티 문의</option>
                </select>
              </li>

              <li>
                <label htmlFor="writer">작성자</label>
                <input
                  type="text"
                  id={"writer"}
                  required
                  maxLength={20}
                  value={writer}
                  onChange={(e) => setWriter(e.target.value)}
                />
              </li>

              <li>
                <label htmlFor="title">제목</label>
                <input
                  type="text"
                  id={"title"}
                  required
                  maxLength={100}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </li>

              <li>
                <label htmlFor="content">문의 사항</label>
                <textarea
                  id={"content"}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </li>

              {/*<li>*/}
              {/*  <label htmlFor="file">첨부파일</label>*/}
              {/*  <input*/}
              {/*    type="file"*/}
              {/*    onChange={(e) => setFile(e.target.files[0])}*/}
              {/*  />*/}
              {/*</li>*/}

              <li>
                <input
                  type="checkbox"
                  id={"secret"}
                  value={secret}
                  onChange={(e) => setSecret(e.target.checked)}
                />
                <label htmlFor="secret">비밀글 설정</label>
              </li>
            </ul>
          </fieldset>

          <button className={"btn btn-dark"} onClick={handleSaveButton}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

export default InquiryAdd;
