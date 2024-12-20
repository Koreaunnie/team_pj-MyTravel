import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Box,
  DialogTitle,
  HStack,
  Icon,
  Image,
  Input,
  Stack,
  Table,
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
import { FiMessageSquare } from "react-icons/fi";
import { LuPencilLine } from "react-icons/lu";
import { IoMdHeart, IoMdHeartEmpty, IoMdPhotos } from "react-icons/io";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { HiOutlineBookOpen } from "react-icons/hi";
import { GoHeart } from "react-icons/go";
import { AiOutlineComment } from "react-icons/ai";
import { toaster } from "../../components/ui/toaster.jsx";
import CommentContainer from "./comment/CommentContainer.jsx";
import { Modal } from "../../components/root/Modal.jsx";
import { formattedDateTime } from "../../components/utils/FormattedDateTime.jsx";

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
  const [countCommunity, setCountCommunity] = useState(0);
  const [commentContent, setCommentContent] = useState("");
  const [myCommunityLike, setMyCommunityLike] = useState(false);
  const [communityList, setCommunityList] = useState([]);
  const [searchParams] = useSearchParams();
  const authentication = useContext(AuthenticationContext);
  const { hasAccessByNickName, isAdmin } = useContext(AuthenticationContext);
  const { pathname } = useLocation();
  const [titleLength, setTitleLength] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [likeModalOpen, setLikeModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/community/view/${id}`, { id })
      .then((e) => {
        setCommunity(e.data);
        setCommentList(e.data.commentList);
        setMyCommunityLike(e.data.myCommunityLike);
        setTitleLength(e.data.title.length);
        setCreationDate(e.data.creationDate.substring(0, 19));
      })
      .catch((e) => {
        const message = e.request.response.message || {
          type: "error",
          text: "존재하지 않는 게시물입니다.",
        };
        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate(`/community/list`);
      });
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    axios.get(`/api/community/list?${searchParams.toString()}`).then((res) => {
      setCommunityList(res.data.list);
      setCountCommunity(res.data.countCommunity);
    });
  }, [pathname]);

  const handleDeleteClick = () => {
    axios
      .delete(`/api/community/delete/${id}`)
      .then((e) => {
        const deleteSuccess = e.data.message;
        toaster.create({
          type: deleteSuccess.type,
          description: deleteSuccess.text,
        });
        navigate(`/community/list`);
      })
      .catch((e) => {
        const deleteFailure = e.request.response;
        const parsingKey = JSON.parse(deleteFailure);
        const type = parsingKey.message.type;
        const text = parsingKey.message.text;
        toaster.create({
          type: type,
          description: text,
        });
        navigate(`/`);
      });
  };

  const handleEditClick = () => {
    navigate(`/community/edit/${id}`);
    ///community/edit/18
  };

  const fetch = () => {
    axios
      .get(`/api/community/fetch/${id}`)
      .then((res) => {
        setCommunity(res.data);
        setCommentList(res.data.commentList);
        setMyCommunityLike(res.data.myCommunityLike);
      })
      .catch((err) => console.error(err));
    axios.get(`/api/community/list?${searchParams.toString()}`).then((res) => {
      setCommunityList(res.data.list);
      setCountCommunity(res.data.countCommunity);
    });
  };

  const handleCommentSaveClick = () => {
    axios
      .post(`/api/community/comment/write`, {
        comment,
        communityId: community.id,
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
      .finally(() => setComment(""));
  };

  const handleCommentDeleteClick = (id) => {
    axios
      .delete(`/api/community/comment/delete/${id}`)
      .then((e) => {
        const deleteSuccess = e.data.message;
        toaster.create({
          type: deleteSuccess.type,
          description: deleteSuccess.text,
        });
        fetch();
      })
      .catch((e) => {
        const deleteFailure = e.request.response;
        const parsingKey = JSON.parse(deleteFailure);
        const type = parsingKey.message.type;
        const text = parsingKey.message.text;
        toaster.create({
          type: type,
          description: text,
        });
      });
  };

  const handleCommentChange = (id, value) => {
    setCommentContent((prev) => ({ ...prev, [id]: value }));
  };

  const handleCommentUpdateClick = (id) => {
    const updatedComment = commentContent[id]; // 수정된 댓글 가져오기
    axios
      .put(`/api/community/comment/edit/${id}`, { comment: updatedComment })
      .then((e) => {
        const updateSuccess = e.data.message;
        toaster.create({
          type: updateSuccess.type,
          description: updateSuccess.text,
        });
        fetch();
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

  const handleLikeClick = () => {
    axios
      .post(`/api/community/like/${id}`)
      .then(() => {
        fetch();
      })
      .finally(() => setMyCommunityLike(!myCommunityLike));
  };

  // 리스트

  function handleWriteClick() {
    navigate(`/community/write`);
  }

  function handleViewClick(id) {
    axios
      .get(`/api/community/view/${id}`)
      .then((e) => {
        setCommunity(e.data);
        setCommentList(e.data.commentList);
        setMyCommunityLike(e.data.myCommunityLike);
      })
      .then(navigate(`/community/view/${id}`));
  }

  function handleLoginClick() {
    navigate(`/member/login`);
  }

  return (
    <div className={"community"}>
      <Breadcrumb
        depth1={"커뮤니티"}
        navigateToDepth1={() => navigate(`/community/list`)}
        depth2={
          titleLength > 15
            ? `${community.title.substring(0, 15)}...`
            : community.title
        }
        navigateToDepth2={() => navigate(`/community/view/${community.id}`)}
      />

      <div className={"body-normal"}>
        <h1>커뮤니티</h1>
        <h2>여러분의 여행 이야기를 들려주세요.</h2>

        <div className={"btn-wrap"}>
          <button
            className={"btn btn-dark-outline"}
            onClick={() => navigate("/community/list")}
          >
            목록
          </button>

          {authentication.isAuthenticated && (
            <div>
              {hasAccessByNickName(community.writer) && (
                <button
                  className={"btn btn-dark-outline"}
                  onClick={() => setEditModalOpen(true)}
                >
                  수정
                </button>
              )}

              {(hasAccessByNickName(community.writer) ||
                authentication.isAdmin) && (
                <button
                  className={"btn btn-warning"}
                  onClick={() => setDeleteModalOpen(true)}
                >
                  삭제
                </button>
              )}

              <button className={"btn btn-dark"} onClick={handleWriteClick}>
                글 쓰기
              </button>
            </div>
          )}
        </div>

        <div className={"table-view"}>
          <Box>
            <Field readOnly>
              <HStack>
                <Icon>
                  <HiOutlineBookOpen />
                </Icon>{" "}
                : {community.views} | {creationDate}
              </HStack>
            </Field>

            <Field readOnly>
              <Textarea value={community.content} />
            </Field>
            <Field label={"파일"} readOnly>
              <ImageFileView files={community.files} />
            </Field>

            <div className={"like-wrap"}>
              <ul>
                <li className={"icon"}>
                  <Icon
                    color="red.600"
                    onClick={() => {
                      if (authentication.isAuthenticated) {
                        handleLikeClick(); // 로그인한 경우 좋아요 처리
                      } else {
                        setLikeModalOpen(true);
                      }
                    }}
                  >
                    {myCommunityLike ? <IoMdHeart /> : <IoMdHeartEmpty />}
                  </Icon>
                </li>
                <li>{community.like}</li>
              </ul>
            </div>
          </Box>

          <table className={"table-view"}>
            <thead>
              <tr className={"thead-title"}>
                <th colSpan={2}>{community.title}</th>
              </tr>
              <tr className={"thead-sub-title"}>
                <th>{community.writer}</th>
                <th>{formattedDateTime(community.creationDate)}</th>
              </tr>
              <tr className={"thead-sub-title"}>
                <th>
                  <GoHeart /> {community.numberOfLikes} |{" "}
                </th>
                <th>
                  <HiOutlineBookOpen /> {community.numberOfViews}
                </th>
              </tr>
              <tr>
                <th colSpan={2}>조회수 {community.views}</th>
              </tr>
            </thead>

            <tbody>
              <tr className={"tbody-content"}>
                <td>{community.content}</td>
                <td>{community.files}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ border: "1px solid red" }}>
            <CommentContainer
              communityId={community.id}
              communityWriter={community.writer}
            />
          </div>

          <Box>
            <Stack>
              <Field fontSize="xl">
                <strong>
                  <HStack>
                    <FiMessageSquare />
                    코멘트 ({commentList.length})
                  </HStack>
                </strong>
              </Field>

              <Field>
                {commentList.map((list) => (
                  <Box value={list.id}>
                    <HStack>
                      <Stack>
                        <HStack>
                          <Field w={300}>{list.writer}</Field>
                          <Field>{list.creationDate}</Field>
                        </HStack>
                        <HStack>
                          <Input value={list.comment} readOnly w={450} />
                          {/* TODO : 권한받은 유저만 보이게 */}
                          <Box>
                            <HStack>
                              {hasAccessByNickName(list.writer) && (
                                <DialogRoot>
                                  <DialogTrigger asChild>
                                    <div>
                                      <Button
                                        className={"btn btn-blue"}
                                        variant="outline"
                                      >
                                        수정
                                      </Button>
                                    </div>
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
                                        <div>
                                          <button
                                            className={"btn btn-dark-outline"}
                                            variant="outline"
                                          >
                                            취소
                                          </button>
                                        </div>
                                      </DialogActionTrigger>
                                      <DialogActionTrigger>
                                        <div>
                                          <Button
                                            className={"btn btn-blue"}
                                            onClick={() =>
                                              handleCommentUpdateClick(list.id)
                                            }
                                          >
                                            수정
                                          </Button>
                                        </div>
                                      </DialogActionTrigger>
                                    </DialogFooter>
                                  </DialogContent>
                                </DialogRoot>
                              )}
                              {(hasAccessByNickName(list.writer) ||
                                authentication.isAdmin) && (
                                <DialogRoot>
                                  <DialogTrigger>
                                    <div>
                                      <Button className={"btn btn-warning"}>
                                        삭제
                                      </Button>
                                    </div>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>글 삭제</DialogHeader>
                                    <DialogBody>
                                      해당 댓글을 정말 삭제하시겠습니까?
                                    </DialogBody>
                                    <DialogFooter>
                                      <DialogActionTrigger>
                                        <div>
                                          <button
                                            className={"btn btn-dark-outline"}
                                          >
                                            취소
                                          </button>
                                        </div>
                                      </DialogActionTrigger>
                                      <DialogActionTrigger>
                                        <div>
                                          <Button
                                            className={"btn btn-warning"}
                                            onClick={() =>
                                              handleCommentDeleteClick(list.id)
                                            }
                                          >
                                            삭제
                                          </Button>
                                        </div>
                                      </DialogActionTrigger>
                                    </DialogFooter>
                                  </DialogContent>
                                </DialogRoot>
                              )}
                            </HStack>
                          </Box>
                        </HStack>
                      </Stack>
                    </HStack>
                  </Box>
                ))}
              </Field>
            </Stack>
          </Box>

          <br />
          <br />
          <Box>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>제목</Table.ColumnHeader>
                  <Table.ColumnHeader>작성자</Table.ColumnHeader>
                  <Table.ColumnHeader>작성일시</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {communityList.map((c) => (
                  <Table.Row onClick={() => handleViewClick(c.id)} key={c.id}>
                    <Table.Cell>
                      <Stack>
                        <HStack>
                          <h3>
                            {c.title.length > 25
                              ? `${c.title.substring(0, 25)}...`
                              : c.title}
                          </h3>
                          {c.existOfFiles ? <IoMdPhotos /> : " "}
                        </HStack>
                        <h4>
                          <HStack>
                            <GoHeart /> {c.numberOfLikes} | <AiOutlineComment />{" "}
                            {c.numberOfComments} | <HiOutlineBookOpen />{" "}
                            {c.numberOfViews}
                          </HStack>
                        </h4>
                      </Stack>
                    </Table.Cell>
                    <Table.Cell>{c.writer}</Table.Cell>
                    <Table.Cell>{c.creationDate}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </div>
      </div>

      {/* 수정 modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onConfirm={handleEditClick}
        message="게시글을 수정하시겠습니까?"
        buttonMessage="수정"
      />

      {/* 삭제 modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteClick}
        message="게시글을 삭제하시겠습니까?"
        buttonMessage="삭제"
      />

      {/* 좋아요 modal */}
      <Modal
        isOpen={likeModalOpen}
        onClose={() => setLikeModalOpen(false)}
        onConfirm={() => navigate("/member/login")}
        message="로그인 한 회원만 게시글 추천이 가능합니다."
        buttonMessage="로그인"
      />
    </div>
  );
}

export default CommunityView;
