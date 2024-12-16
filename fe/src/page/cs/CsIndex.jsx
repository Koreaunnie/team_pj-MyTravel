import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import { useNavigate } from "react-router-dom";
import "./CsIndex.css";
import axios from "axios";
import { CiLock } from "react-icons/ci";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";

function CsIndex(props) {
  const [faqList, setFaqList] = useState([]);
  const [inquiryList, setInquiryList] = useState([]);
  const navigate = useNavigate();
  const { nickname } = useContext(AuthenticationContext);

  useEffect(() => {
    axios.get("/api/cs/index").then((res) => {
      setFaqList(res.data.faq);
      setInquiryList(res.data.inquiry);
    });
  }, []);

  // 비밀글 여부 확인
  const checkSecretOrNot = (inquiry) => {
    console.log(inquiry.secret, inquiry.writerNickname, nickname);
    if (inquiry.secret && inquiry.writerNickname != nickname) {
      toaster.create({
        type: "warning",
        description: "비공개 문의내역은 작성자 본인만 확인하실 수 있습니다.",
      });
    } else {
      navigate(`/cs/inquiry/view/${inquiry.id}`);
    }
  };

  // 날짜 포맷팅
  const formattedDate = (props) => {
    const date = new Date(props);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 해줘야 함
    const day = String(date.getDate()).padStart(2, "0"); // 두 자릿수로 맞추기 위해 padStart 사용

    return `${year}-${month}-${day}`;
  };

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
                <ul key={inquiry.id} onClick={() => checkSecretOrNot(inquiry)}>
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
                  <li className={"date"}>{formattedDate(inquiry.inserted)}</li>
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
