import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import axios from "axios";
import { Alert } from "../../components/ui/alert.jsx";
import NoticeList from "./NoticeList.jsx";
import { toaster } from "../../components/ui/toaster.jsx";

function NoticeEdit(props) {
  const [notice, setNotice] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasAccessByNickName } = useContext(AuthenticationContext);

  useEffect(() => {
    axios.get(`/api/notice/view/${id}`).then((res) => {
      setNotice(res.data);
    });
  }, []);

  const handleSaveClick = () => {
    axios
      .put(`/api/notice/edit`, {
        id: notice.id,
        title: notice.title,
        content: notice.content,
      })
      .then((e) => {
        const updateSuccess = e.data.message;
        toaster.create({
          type: updateSuccess.type,
          description: updateSuccess.text,
        });
        navigate(`/notice/view/${e.data.id}`);
      })
      .catch((e) => {
        const updateFailure = e.request.response;
        const parsingKey = JSON.parse(updateFailure);
        const type = parsingKey.message.type;
        const text = parsingKey.message.text;
        toaster.create({
          type: type,
          description: text,
        });
      });
  };

  const handleCancelClick = () => {
    navigate(`/notice/view/${id}`);
  };

  return (
    <div className={"notice-form form-container"}>
      {hasAccessByNickName(notice.writer) && (
        <div className={"body-normal"}>
          <h1>공지사항 수정</h1>

          <div className={"form-wrap"}>
            <div className={"btn-wrap"}>
              <button
                className={"btn btn-dark-outline"}
                onClick={handleCancelClick}
              >
                목록
              </button>
              <button className={"btn btn-dark"} onClick={handleSaveClick}>
                저장
              </button>
            </div>

            <fieldset>
              <label htmlFor="title">제목</label>
              <input
                type={"text"}
                id={"title"}
                value={notice.title}
                onChange={(e) =>
                  setNotice({ ...notice, title: e.target.value })
                }
              />
              <label htmlFor="content">본문</label>
              <textarea
                rows={15}
                id={"content"}
                value={notice.content}
                onChange={(e) =>
                  setNotice({ ...notice, content: e.target.value })
                }
              />
            </fieldset>
          </div>
        </div>
      )}

      {hasAccessByNickName(notice.writer) || (
        <div>
          <Alert status="warning" title="접근 권한이 없습니다." />
          <NoticeList />
        </div>
      )}
    </div>
  );
}

export default NoticeEdit;
