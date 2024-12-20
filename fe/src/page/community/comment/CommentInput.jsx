import { Button } from "../../../components/ui/button.jsx";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "../../../components/ui/dialog.jsx";
import { HStack } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../../components/context/AuthenticationProvider.jsx";
import axios from "axios";
import { toaster } from "../../../components/ui/toaster.jsx";
import { useNavigate } from "react-router-dom";

export function CommentInput({ communityId, communityWriter }) {
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]); // 댓글 목록 상태 추가
  const navigate = useNavigate();
  const authentication = useContext(AuthenticationContext);

  useEffect(() => {
    // 댓글 목록을 불러오는 함수
    axios
      .get(`/api/community/comment/list/${communityId}`, { communityId })
      .then((res) => {
        setCommentList(res.data); // 댓글 목록 업데이트
      });
  }, [communityId]); // communityId가 변경될 때마다 댓글 목록을 불러옴

  const fetch = () => {
    axios
      .get(`/api/community/fetch/${communityId}`)
      .then((res) => {
        console.log(res.data);
        setCommentList(res.data.commentList);
      })
      .catch((err) => console.error(err));
  };

  const handleCommentSaveClick = () => {
    if (!comment.trim()) {
      toaster.create({
        type: "error",
        description: "댓글을 작성해 주세요.",
      });
      return;
    }

    axios
      .post(`/api/community/comment/write`, {
        comment,
        communityId: communityId,
      })
      .then((res) => {
        const writeSuccess = res.data.message;
        toaster.create({
          type: writeSuccess.type,
          description: writeSuccess.text,
        });
        fetch();
      })
      .finally(() => setComment(""));
  };

  function handleLoginClick() {
    navigate(`/member/login`);
  }

  return (
    <div className={"body-normal"}>
      <div className={"comment-input"}>
        {authentication.isAuthenticated ? (
          <div>
            <label htmlFor="comment">
              {communityWriter + " 님에게 댓글 작성"}
            </label>
            <textarea
              rows={5}
              placeholder="댓글 쓰기"
              id={"comment"}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button className={"btn btn-dark"} onClick={handleCommentSaveClick}>
              댓글 등록
            </button>
          </div>
        ) : (
          <DialogRoot>
            <DialogTrigger>
              <HStack>
                <textarea
                  rows={5}
                  placeholder="로그인 후 댓글을 작성하실 수 있습니다."
                />
                <div>
                  <button className={"btn btn-dark"}>댓글 등록</button>
                </div>
              </HStack>

              <DialogContent>
                <DialogHeader>MyTravel</DialogHeader>
                <DialogBody>
                  로그인을 한 회원만 댓글 작성이 가능합니다.
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger>
                    <div>
                      <Button
                        className={"btn btn-dark"}
                        onClick={handleLoginClick}
                      >
                        확인
                      </Button>
                    </div>
                  </DialogActionTrigger>
                </DialogFooter>
              </DialogContent>
            </DialogTrigger>
          </DialogRoot>
        )}
      </div>
      <br />
    </div>
  );
}
