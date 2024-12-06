import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import { useNavigate } from "react-router-dom";
import "./CsIndex.css";
import { Spinner } from "@chakra-ui/react";
import axios from "axios";

function CsIndex(props) {
  const [inquiryList, setInquiryList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/cs/index").then((res) => setInquiryList(res.data));
  }, []);

  if (!inquiryList || inquiryList.length === 0) {
    return <Spinner />;
  }

  return (
    <div className={"cs"}>
      <Breadcrumb
        depth1={"고객센터"}
        navigateToDepth1={() => navigate(`/cs/index`)}
      />

      <div>
        <h1>무엇을 도와드릴까요?</h1>

        <section className={"faq-container body-normal"}>
          <h3>자주 하는 질문</h3>

          <button
            className={"more-btn"}
            onClick={() => navigate("/cs/faq/list")}
          >
            더 보기
          </button>

          <ul>
            <li>
              <span>Q.</span>
              환불 규정이 어떻게 되나요?
            </li>
            <li>
              <span>Q.</span>
              환불 규정이 어떻게 되나요?
            </li>
            <li>
              <span>Q.</span>
              환불 규정이 어떻게 되나요?
            </li>
            <li>
              <span>Q.</span>
              환불 규정이 어떻게 되나요?
            </li>
            <li>
              <span>Q.</span>
              환불 규정이 어떻게 되나요?
            </li>
          </ul>
        </section>

        <div className={"cs-wrap"}>
          <div className={"body-normal"}>
            <section className={"inquiry-container"}>
              <h3>문의 게시판</h3>

              <button
                className={"more-btn"}
                onClick={() => navigate("/cs/inquiry/list")}
              >
                더 보기
              </button>

              <ul>
                {inquiryList.map((inquiry) => (
                  <li
                    key={inquiry.id}
                    onClick={() => navigate(`/cs/inquiry/view/${inquiry.id}`)}
                  >
                    {inquiry.title}
                    <span>{inquiry.date}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={"tel-container"}>
              <h3>
                고객센터 <span>1588-1111</span>
              </h3>

              <ul>
                <li>평일: 09:00 ~ 18:00</li>
                <li>주말 / 공휴일 휴무</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CsIndex;
