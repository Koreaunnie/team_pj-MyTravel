import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import axios from "axios";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import { Box, HStack, Icon, Input, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { HiOutlineBookOpen } from "react-icons/hi";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";
import { Button } from "../../components/ui/button.jsx";
import NoticeList from "./NoticeList.jsx";

function NoticeView(props) {
  const { id } = useParams();
  const [notice, setNotice] = useState({});
  const navigate = useNavigate();
  const [myNoticeLike, setMyNoticeLike] = useState(false);
  const authentication = useContext(AuthenticationContext);
  const { hasAccessByNickName } = useContext(AuthenticationContext);

  useEffect(() => {
    axios.get(`/api/notice/view/${id}`, { id }).then((e) => {
      setNotice(e.data);
      setMyNoticeLike(e.data.myNoticeLike);
    });
  }, []);

  const handleDeleteClick = () => {
    axios.delete(`/api/notice/delete/${id}`).then(navigate(`/notice/list`));
  };

  const handleEditClick = () => {
    navigate(`/notice/edit/${id}`);
  };

  const fetchLike = () => {
    axios
      .get(`/api/notice/view/${id}`)
      .then((res) => {
        setNotice(res.data);
      })
      .catch((err) => console.error(err));
  };

  function handleLoginClick() {
    navigate(`/member/login`);
  }

  // TODO: 로그인에 대한 권한 완료 후 좋아요 즉시 반영 시도하기
  const handleLikeClick = () => {
    axios
      .post(`/api/notice/like/${id}`, {
        like: myNoticeLike,
      })
      .then(() => {
        fetchLike();
      })
      .finally(() => setMyNoticeLike(!myNoticeLike));
  };

  return (
    <div>
      <Breadcrumb
        depth1={"공지사항"}
        navigateToDepth1={() => navigate(`/notice/list`)}
        depth2={notice.id + "번 게시물"}
        navigateToDepth2={() => navigate(`/notice/view/${id}`)}
      />
      <div>
        <br />
        <h1>{id}번 공지</h1>
        <Stack>
          <Box>
            <Field readOnly>
              <HStack>
                <Icon fontSize="2xl">
                  <HiOutlineBookOpen />
                </Icon>{" "}
                : {notice.views}
              </HStack>
            </Field>
            <Field label={"제목"} readOnly>
              <Input value={notice.title} />
            </Field>
            <Field label={"본문"} readOnly>
              <Textarea value={notice.content} />
            </Field>
            <Field>
              {authentication.isAuthenticated && (
                <Stack>
                  <Icon
                    fontSize="8xl"
                    color="red.600"
                    onClick={() => {
                      handleLikeClick();
                    }}
                  >
                    {myNoticeLike ? <IoMdHeart /> : <IoMdHeartEmpty />}
                  </Icon>
                  <h5>{notice.like}</h5>
                </Stack>
              )}
              {authentication.isAuthenticated || (
                <Stack>
                  <DialogRoot>
                    <DialogTrigger>
                      <Icon fontSize="8xl" color="red.600">
                        <IoMdHeartEmpty />
                      </Icon>
                      <DialogContent>
                        <DialogHeader>MyTravel</DialogHeader>
                        <DialogBody>
                          로그인을 한 회원만 게시글 추천이 가능합니다.
                        </DialogBody>
                        <DialogFooter>
                          <DialogActionTrigger>
                            <Button onClick={handleLoginClick}>확인</Button>
                          </DialogActionTrigger>
                        </DialogFooter>
                      </DialogContent>
                    </DialogTrigger>
                  </DialogRoot>
                  <h5>{notice.like}</h5>
                </Stack>
              )}
            </Field>
            <Field label={"작성자"} readOnly>
              <Input value={notice.writer} />
            </Field>
            <Field label={"작성일시"} readOnly>
              <Input value={notice.creationDate} />
            </Field>
          </Box>
          {hasAccessByNickName(notice.writer) && (
            <Box>
              <HStack>
                <DialogRoot>
                  <DialogTrigger>
                    <Button>삭제</Button>
                    <DialogContent>
                      <DialogHeader>글 삭제</DialogHeader>
                      <DialogBody>{id}번 게시물을 삭제하시겠습니까?</DialogBody>
                      <DialogFooter>
                        <Button>취소</Button>
                        <DialogActionTrigger>
                          <Button onClick={handleDeleteClick}>삭제</Button>
                        </DialogActionTrigger>
                      </DialogFooter>
                    </DialogContent>
                  </DialogTrigger>
                </DialogRoot>
                <Button onClick={handleEditClick}>수정</Button>
              </HStack>
            </Box>
          )}
          <br />
          <Box>
            <NoticeList />
          </Box>
        </Stack>
      </div>
    </div>
  );
}

export default NoticeView;
