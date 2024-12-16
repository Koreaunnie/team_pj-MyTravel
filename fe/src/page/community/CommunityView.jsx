import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  DialogTitle,
  HStack,
  Icon,
  Image,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import CommunityList from "./CommunityList.jsx";
import { FiMessageSquare } from "react-icons/fi";
import { LuPencilLine } from "react-icons/lu";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

function ImageFileView({ files }) {
  return (
    <Box>
      {files?.map((file) => (
        <Image
          key={file.fileName}
          src={file.filePath}
          border={"1px solid black"}
          m={3}
        />
      ))}
    </Box>
  );
}

function CommunityView(props) {
  const { id } = useParams();
  const [community, setCommunity] = useState({});
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [myCommunityLike, setMyCommunityLike] = useState(false);

  useEffect(() => {
    axios.get(`/api/community/view/${id}`, { id }).then((e) => {
      setCommunity(e.data);
      setCommentList(e.data.commentList);
    });
  }, []);

  const handleDeleteClick = () => {
    axios
      .delete(`/api/community/delete/${id}`)
      .then(navigate(`/community/list`));
  };

  const handleEditClick = () => {
    navigate(`/community/edit/${id}`);
    ///community/edit/18
  };

  const fetchComments = () => {
    axios
      .get(`/api/community/view/${id}`)
      .then((res) => {
        setCommentList(res.data.commentList);
      })
      .catch((err) => console.error(err));
  };

  const fetchLike = () => {
    axios.get(`api/community/view/${id}`).then((res) => {
      setMyCommunityLike();
    });
  };

  const handleCommentSaveClick = () => {
    axios
      .post(`/api/community/comment/write`, {
        comment,
        communityId: community.id,
      })
      .then(() => fetchComments())
      .finally(() => setComment(""));
  };

  const handleCommentDeleteClick = (id) => {
    axios.delete(`/api/community/comment/delete/${id}`).then(() => {
      fetchComments();
    });
  };

  const handleCommentChange = (id, value) => {
    setCommentContent((prev) => ({ ...prev, [id]: value }));
  };

  const handleCommentUpdateClick = (id) => {
    const updatedComment = commentContent[id]; // 수정된 댓글 가져오기
    axios
      .put(`/api/community/comment/edit/${id}`, { comment: updatedComment })
      .then(() => {
        // 댓글 목록 갱신
        fetchComments();
      })
      .catch((err) => console.error(err));
  };

  // TODO: 로그인에 대한 권한 완료 후 좋아요 즉시 반영 시도하기
  // const handleLikeClick = () => {
  //   setMyCommunityLike(!myCommunityLike);
  //   if (myCommunityLike) {
  //     axios
  //       .post(`/api/community/like/${id}`, {
  //         like: myCommunityLike,
  //       })
  //       .then(() => fetchComments());
  //   } else {
  //     axios
  //       .delete(`/api/community/like/delete?id=${id}&nickName=${}`)
  //       .then(() => fetchLike());
  //   }
  // };

  return (
    <div>
      <Breadcrumb
        depth1={"커뮤니티"}
        navigateToDepth1={() => navigate(`/community/list`)}
        depth2={community.id + "번 게시물"}
        navigateToDepth2={() => navigate(`/community/view/${id}`)}
      />
      <div>
        <br />
        <h1>{id}번 게시물</h1>
        <Stack>
          <Box>
            <Field label={"제목"} readOnly>
              <Input value={community.title} />
            </Field>
            <Field label={"본문"} readOnly>
              <Textarea value={community.content} />
            </Field>
            <Field label={"파일"} readOnly>
              <ImageFileView files={community.files} />
            </Field>
            <Field>
              <Stack>
                <Icon
                  fontSize="8xl"
                  color="red.600"
                  onClick={
                    // handleLikeClick
                    () => setMyCommunityLike(!myCommunityLike)
                  }
                >
                  {myCommunityLike ? <IoMdHeart /> : <IoMdHeartEmpty />}
                </Icon>
                <h5>{community.like}</h5>
              </Stack>
            </Field>
            <Field label={"작성자"} readOnly>
              <Input value={community.writer} />
            </Field>
            <Field label={"작성일시"} readOnly>
              <Input value={community.creationDate} />
            </Field>
          </Box>
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
          <br />
          {/*  TODO: 코멘트 작성, 코멘트 리스트 추가 */}
          <Box>
            <Stack>
              <Field label={community.writer + " 님에게 댓글 작성"}>
                <HStack>
                  <Textarea
                    h={100}
                    w={700}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button h={100} onClick={handleCommentSaveClick}>
                    댓글 등록
                  </Button>
                </HStack>
              </Field>
              <br />
              <Field>
                <h2>
                  <HStack>
                    <FiMessageSquare />
                    코멘트 ({commentList.length})
                  </HStack>
                </h2>
                {commentList.map((list) => (
                  <Box value={list.id}>
                    <HStack>
                      <Stack>
                        <HStack>
                          <Field>{list.writer}</Field>
                          <Field>{list.creationDate}</Field>
                        </HStack>
                        <Input value={list.comment} readOnly />
                      </Stack>
                      {/* TODO : 권한받은 유저만 보이게 */}
                      <DialogRoot>
                        <DialogTrigger asChild>
                          <Button variant="outline">수정</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>댓글 수정</DialogTitle>
                          </DialogHeader>
                          <DialogBody pb="4">
                            <Stack gap="4">
                              <Field>
                                <HStack>
                                  <LuPencilLine /> 수정하기
                                </HStack>
                                <Textarea
                                  defaultValue={list.comment} // 기존 댓글 내용 표시
                                  onChange={
                                    (e) =>
                                      handleCommentChange(
                                        list.id,
                                        e.target.value,
                                      ) // 변경 이벤트 핸들러
                                  }
                                  placeholder="내용을 입력해주세요."
                                />
                              </Field>
                            </Stack>
                          </DialogBody>
                          <DialogFooter>
                            <DialogActionTrigger asChild>
                              <Button variant="outline">취소</Button>
                            </DialogActionTrigger>
                            <DialogActionTrigger>
                              <Button
                                onClick={() =>
                                  handleCommentUpdateClick(list.id)
                                }
                              >
                                수정
                              </Button>
                            </DialogActionTrigger>
                          </DialogFooter>
                        </DialogContent>
                      </DialogRoot>
                      <DialogRoot>
                        <DialogTrigger>
                          <Button>삭제</Button>
                          <DialogContent>
                            <DialogHeader>글 삭제</DialogHeader>
                            <DialogBody>
                              해당 댓글을 정말 삭제하시겠습니까?
                            </DialogBody>
                            <DialogFooter>
                              <Button>취소</Button>
                              <Button
                                onClick={() =>
                                  handleCommentDeleteClick(list.id)
                                }
                              >
                                삭제
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </DialogTrigger>
                      </DialogRoot>
                    </HStack>
                  </Box>
                ))}
              </Field>
            </Stack>
          </Box>
          <Box>
            <CommunityList />
          </Box>
        </Stack>
        <input type="hidden" value={loading} />
      </div>
    </div>
  );
}

export default CommunityView;
