import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../../components/root/Breadcrumb.jsx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";

function InquiryEdit(props) {
  const { id } = useParams();
  const [inquiry, setInquiry] = useState(null);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // const [files, setFiles] = useState([]);
  const [secret, setSecret] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/cs/inquiry/view/${id}`).then((res) => {
      setInquiry(res.data);
      setCategory(res.data.category);
      setTitle(res.data.title);
      setContent(res.data.content);
      setSecret(res.data.secret);
    });
  }, [id]);

  const handleSaveButton = () => {
    axios
      .put("/api/cs/inquiry/update", {
        id,
        category,
        title,
        content,
        secret,
      })
      .then((response) => {
        console.log("성공적으로 저장됨:", response);
        navigate("/cs/inquiry/list");
      });
  };

  if (inquiry == null) {
    return <Spinner />;
  }

  return (
    <div className={"inquiry"}>
      <Breadcrumb
        depth1={"고객센터"}
        navigateToDepth1={() => navigate(`/cs`)}
        depth2={"문의하기"}
        navigateToDepth2={() => navigate(`/cs/inquiry/list`)}
        depth3={"문의글 수정"}
        navigateToDepth3={() => navigate(`/cs/inquiry/edit/${id}`)}
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
                <label htmlFor="content">문의 내용</label>
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
                  checked={secret}
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

export default InquiryEdit;
