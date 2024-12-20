import React from "react";
import { useNavigate } from "react-router-dom";

function Access(props) {
  const navigate = useNavigate();

  return (
    <>
      <h1>현재 이 페이지에 엑세스할 수 있는 권한이 없습니다.</h1>
      <button
        className={"btn btn-dark-outline"}
        onClick={() => {
          navigate(`/`);
        }}
      >
        홈페이지로 이동
      </button>
      <button
        onClick={() => navigate(`/member/login`)}
        className={"btn btn-dark-outline"}
      >
        로그인 페이지로 이동
      </button>
      <br />
    </>
  );
}

export default Access;
