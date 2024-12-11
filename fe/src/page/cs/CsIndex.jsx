import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import { useNavigate } from "react-router-dom";
import "./CsIndex.css";
import axios from "axios";
import { CiLock } from "react-icons/ci";

function CsIndex(props) {
  const [faqList, setFaqList] = useState([]);
  const [inquiryList, setInquiryList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/cs/index").then((res) => {
      setFaqList(res.data.faq);
      setInquiryList(res.data.inquiry);
    });
  }, []);

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
            {faqList.map((faq) => (
              <li
                key={faq.id}
                onClick={() => navigate(`/cs/faq/view/${faq.id}`)}
              >
                <span>Q. </span>
                {faq.question}
              </li>
            ))}
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

              {inquiryList.map((inquiry) => (
                <ul
                  key={inquiry.id}
                  onClick={() => navigate(`/cs/inquiry/view/${inquiry.id}`)}
                >
                  {inquiry.secret ? (
                    <li className={"secret"}>
                      <span className={"icon"}>
                        <CiLock />
                      </span>
                      비밀글입니다.
                    </li>
                  ) : (
                    <li>{inquiry.title}</li>
                  )}
                  <li className={"date"}>{inquiry.inserted}</li>
                </ul>
              ))}
            </section>

            <section className={"tel-container"}>
              <h3>고객센터</h3>
              <h5>1588-1111</h5>

              <ul>
                <li>&#10023; 평일: 09:00 ~ 18:00</li>
                <li>&#10023; 주말 / 공휴일 휴무</li>
                <li>휴무일에는 문의 게시판을 이용해주세요.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CsIndex;
