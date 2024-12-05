import React from "react";
import { Breadcrumb } from "/src/components/root/Breadcrumb.jsx";
import { useNavigate } from "react-router-dom";

function InquiryAdd(props) {
  const navigate = useNavigate();

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
        <form action="">
          <fieldset>
            <ul>
              <li>
                <label htmlFor="category">문의 유형</label>
                <select name="" id="category">
                  <option value="plan">내 여행 문의</option>
                  <option value="wallet">내 지갑 문의</option>
                  <option value="tour">투어 문의</option>
                  <option value="community">커뮤니티 문의</option>
                </select>
              </li>

              <li>
                <label htmlFor="title">제목</label>
                <input type="text" id={"title"} required maxLength={"100"} />
              </li>

              <li>
                <label htmlFor="content">문의 사항</label>
                <textarea id={"content"} />
              </li>

              <li>
                <label htmlFor="file">첨부파일</label>
                <input type="file" />
              </li>

              <li>
                <input type="checkbox" id={"secret"} />
                <label htmlFor="secret">비밀글 설정</label>
              </li>
            </ul>
          </fieldset>

          <button className={"btn btn-dark"}>저장</button>
        </form>
      </div>
    </div>
  );
}

export default InquiryAdd;
