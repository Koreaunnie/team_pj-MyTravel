import { Textarea } from "@chakra-ui/react";
import { Button } from "../../../components/ui/button.jsx";
import React, { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../../components/context/AuthenticationProvider.jsx";
import axios from "axios";
import { toaster } from "../../../components/ui/toaster.jsx";
import { formattedDateTime } from "../../../components/utils/FormattedDateTime.jsx";
import "./Comment.css";

export function CommentList({ communityId, onEditClick, onDeleteClick }) {
  const [commentList, setCommentList] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [editMode, setEditMode] = useState(null);
  const { hasAccessByNickName } = useContext(AuthenticationContext);
  const authentication = useContext(AuthenticationContext);

  useEffect(() => {
    // 댓글 목록을 가져옵니다.
    axios
      .get(`/api/community/view/${communityId}`)
      .then((res) => {
        setCommentList(res.data.commentList);
      })
      .catch((err) => console.error(err));
  }, [communityId]);

  // 댓글 목록을 다시 가져오는 함수
  const fetch = () => {
    axios
      .get(`/api/community/fetch/${communityId}`)
      .then((res) => {
        setCommentList(res.data.commentList);
      })
      .catch((err) => console.error(err));
  };

  // 댓글 저장 함수
  const handleCommentSaveClick = () => {
    axios
      .post(`/api/community/comment/write`, {
        comment: commentContent,
        communityId: communityId,
      })
      .then((e) => {
        const writeSuccess = e.data.message;
        toaster.create({
          type: writeSuccess.type,
          description: writeSuccess.text,
        });
        fetch();
      })
      .catch((e) => {
        const writeFailure = e.request.response;
        const parsingKey = JSON.parse(writeFailure);
        const type = parsingKey.message.type;
        const text = parsingKey.message.text;
        toaster.create({
          type: type,
          description: text,
        });
      })
      .finally(() => setCommentContent(""));
  };

  // 댓글 수정 함수
  const handleCommentUpdateClick = (id) => {
    // 수정된 댓글을 서버로 보내는 API 호출
    axios
      .put(`/api/community/comment/edit/${id}`, { comment: commentContent })
      .then((e) => {
        const updateSuccess = e.data.message;
        toaster.create({
          type: updateSuccess.type,
          description: updateSuccess.text,
        });

        // 댓글 목록을 갱신
        fetch();

        // 수정 모드 종료
        setEditMode(null);
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

  // 댓글 수정 입력값 관리
  const handleCommentChange = (id, value) => {
    setCommentContent(value);
  };

  const handleEditClick = (id, currentComment) => {
    setEditMode(id); // 수정할 댓글로 전환
    setCommentContent(currentComment); // 기존 댓글 내용으로 설정
  };

  return (
    <div className={"community-comment body-normal"}>
      <div>
        <div>💬 댓글 {commentList.length} 개</div>

        {commentList.map((list) => (
          <div className={"comment-list"} key={list.id}>
            <ul className={"comment-btn-wrap"}>
              {hasAccessByNickName(list.writer) && (
                <li onClick={(e) => handleEditClick(list.id, list.comment)}>
                  수정
                </li>
              )}
              {(hasAccessByNickName(list.writer) || authentication.isAdmin) && (
                <li onClick={() => onDeleteClick(list.id)}>삭제</li>
              )}
            </ul>

            {/* 댓글 목록 */}
            <ul className={"comment-list-body"}>
              <li className={"nickname"}>{list.writer}</li>
              <li className={"content"}>
                {editMode === list.id ? (
                  <Textarea
                    value={commentContent}
                    onChange={(e) =>
                      handleCommentChange(list.id, e.target.value)
                    }
                    placeholder="내용을 수정하세요."
                  />
                ) : (
                  list.comment
                )}
              </li>
              <li className={"date"}>{formattedDateTime(list.creationDate)}</li>
            </ul>

            {/* 수정 모드 */}
            {editMode === list.id && (
              <div className={"comment-list-body"}>
                <Button
                  className={"btn btn-dark"}
                  onClick={() => handleCommentUpdateClick(list.id)}
                >
                  수정
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
