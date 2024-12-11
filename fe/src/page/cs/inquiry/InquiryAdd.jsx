import React, { useState } from "react";
import { Breadcrumb } from "/src/components/root/Breadcrumb.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal } from "../../../components/root/Modal.jsx";

function InquiryAdd(props) {
  const [category, setCategory] = useState("plan");
  const [writer, setWriter] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // const [files, setFiles] = useState(null);
  const [secret, setSecret] = useState(false);

  const [backToListModalOpen, setBackToListModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleSaveButton = () => {
    axios
      .post("/api/cs/inquiry/add", {
        category,
        title,
        content,
        secret,
      })
      .then((res) => {
        res.data;
        navigate("/cs/inquiry/list");
      })
      .catch()
      .finally();
  };

  return (
    <div className={"inquiry"}>
      <Breadcrumb
        depth1={"고객센터"}
        navigateToDepth1={() => navigate(`/cs/index`)}
        depth2={"문의 게시판"}
        navigateToDepth2={() => navigate(`/cs/inquiry/list`)}
        depth3={"문의글 작성"}
        navigateToDepth3={() => navigate(`/cs/inquiry/add`)}
      />

      <div className={"body-normal"}>
        <div>
          <fieldset>
            <ul>
              <li>
                <label htmlFor="category">문의 유형</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
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

          <div className={"btn-wrap"}>
            <button
              className={"btn btn-dark-outline"}
              onClick={() => setBackToListModalOpen(true)}
            >
              목록
            </button>

            <button
              className={"btn btn-dark"}
              onClick={() => setSaveModalOpen(true)}
            >
              등록
            </button>
          </div>
        </div>
      </div>

      {/* 목록 modal */}
      <Modal
        isOpen={backToListModalOpen}
        onClose={() => setBackToListModalOpen(false)}
        onConfirm={() => navigate(`/cs/inquiry/list`)}
        message="목록으로 돌아가면 작성한 내용이 사라집니다."
        buttonMessage="목록"
      />

      {/* 저장 modal */}
      <Modal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onConfirm={handleSaveButton}
        message="문의 글을 등록하시겠습니까?"
        buttonMessage="등록"
      />
    </div>
  );
}

export default InquiryAdd;
