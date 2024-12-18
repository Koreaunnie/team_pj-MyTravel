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
  createListCollection,
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
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../components/ui/select.jsx";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";
import { toaster } from "../../components/ui/toaster.jsx";

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
  const [commentContent, setCommentContent] = useState("");
  const [myCommunityLike, setMyCommunityLike] = useState(false);
  const [communityList, setCommunityList] = useState([]);
  const [search, setSearch] = useState({ type: "all", keyword: "" });
  const [searchParams] = useSearchParams();
  const [countCommunity, setCountCommunity] = useState("");
  const authentication = useContext(AuthenticationContext);
  const { hasAccessByNickName } = useContext(AuthenticationContext);
  const { pathname } = useLocation();
  const [titleLength, setTitleLength] = useState("");
  const [creationDate, setCreationDate] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
  }, []);

  useEffect(() => {
    axios.get(`/api/community/list?${searchParams.toString()}`).then((res) => {
      setCommunityList(res.data.list);
      setCountCommunity(res.data.countCommunity);
    });
  }, [searchParams]);

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

  const fetchComments = () => {
    axios
      .get(`/api/community/view/${id}`)
      .then((res) => {
        setCommentList(res.data.commentList);
      })
      .catch((err) => console.error(err));
  };

  const fetchLike = () => {
    axios
      .get(`/api/community/view/${id}`)
      .then((res) => {
        setCommunity(res.data);
      })
      .catch((err) => console.error(err));
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
        fetchComments();
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
        fetchComments();
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
      .then(() => {
        // 댓글 목록 갱신
        fetchComments();
      })
      .catch((err) => console.error(err));
  };

  // TODO: 로그인에 대한 권한 완료 후 좋아요 즉시 반영 시도하기
  const handleLikeClick = () => {
    axios
      .post(`/api/community/like/${id}`, {
        like: myCommunityLike,
      })
      .then(() => {
        fetchLike();
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

  function handleSearchClick() {
    const searchInfo = { type: search.type, keyword: search.keyword };
    const searchQuery = new URLSearchParams(searchInfo);
    navigate(`/community/list?${searchQuery.toString()}`);
  }

  function handlePageChangeClick(e) {
    const pageNumber = { page: e.page };
    const pageQuery = new URLSearchParams(pageNumber);
    const searchInfo = { type: search.type, keyword: search.keyword };
    const searchQuery = new URLSearchParams(searchInfo);
    navigate(
      `/community/list?${searchQuery.toString()}&${pageQuery.toString()}`,
    );
  }

  const optionList = createListCollection({
    items: [
      { label: "전체", value: "all" },
      { label: "제목", value: "title" },
      { label: "본문", value: "content" },
      { label: "작성자", value: "writer" },
    ],
  });

  function handleLoginClick() {
    navigate(`/member/login`);
  }

  return (
    <div>
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
      <div>
        <br />
        <br />
        <h1>{community.title}</h1>
        <Stack>
          <Box>
            <Field readOnly>
              <HStack>
                <Icon fontSize="2xl">
                  <HiOutlineBookOpen />
                </Icon>{" "}
                : {community.views} | {creationDate}
              </HStack>
            </Field>
            <br />
            <Field readOnly>
              <Textarea value={community.content} />
            </Field>
            <Field label={"파일"} readOnly>
              <ImageFileView files={community.files} />
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
                    {myCommunityLike ? <IoMdHeart /> : <IoMdHeartEmpty />}
                  </Icon>
                  <h5>{community.like}</h5>
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
                  <h5>{community.like}</h5>
                </Stack>
              )}
            </Field>
            <Field label={"작성자"} readOnly>
              <Input value={community.writer} />
            </Field>
          </Box>
          {hasAccessByNickName(community.writer) && (
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
          {/*  TODO: 코멘트 작성, 코멘트 리스트 추가 */}
          <Box>
            <Stack>
              <Field label={community.writer + " 님에게 댓글 작성"}>
                {authentication.isAuthenticated && (
                  <HStack>
                    <Textarea
                      h={100}
                      w={700}
                      placeholder="댓글 쓰기"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button h={100} onClick={handleCommentSaveClick}>
                      댓글 등록
                    </Button>
                  </HStack>
                )}
                {authentication.isAuthenticated || (
                  <DialogRoot>
                    <DialogTrigger>
                      <HStack>
                        <Textarea
                          h={100}
                          w={700}
                          placeholder="로그인 후 댓글 작성 가능"
                        />
                        <Button h={100}>댓글 등록</Button>
                      </HStack>
                      <DialogContent>
                        <DialogHeader>MyTravel</DialogHeader>
                        <DialogBody>
                          로그인을 한 회원만 댓글 작성이 가능합니다.
                        </DialogBody>
                        <DialogFooter>
                          <DialogActionTrigger>
                            <Button onClick={handleLoginClick}>확인</Button>
                          </DialogActionTrigger>
                        </DialogFooter>
                      </DialogContent>
                    </DialogTrigger>
                  </DialogRoot>
                )}
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
                          <Field w={300}>{list.writer}</Field>
                          <Field>{list.creationDate}</Field>
                        </HStack>
                        <HStack>
                          <Input value={list.comment} readOnly w={450} />
                          {/* TODO : 권한받은 유저만 보이게 */}
                          {hasAccessByNickName(list.writer) && (
                            <Box>
                              <HStack>
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
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>글 삭제</DialogHeader>
                                    <DialogBody>
                                      해당 댓글을 정말 삭제하시겠습니까?
                                    </DialogBody>
                                    <DialogFooter>
                                      <DialogActionTrigger>
                                        <Button>취소</Button>
                                      </DialogActionTrigger>
                                      <DialogActionTrigger>
                                        <Button
                                          onClick={() =>
                                            handleCommentDeleteClick(list.id)
                                          }
                                        >
                                          삭제
                                        </Button>
                                      </DialogActionTrigger>
                                    </DialogFooter>
                                  </DialogContent>
                                </DialogRoot>
                              </HStack>
                            </Box>
                          )}
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
                          <h3>{c.title}</h3>
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
          <Box>
            <HStack>
              <Box>
                <HStack>
                  <SelectRoot
                    collection={optionList}
                    defaultValue={["all"]}
                    onChange={(oc) =>
                      setSearch({ ...search, type: oc.target.value })
                    }
                    size="sm"
                    width="130px"
                  >
                    <SelectTrigger>
                      <SelectValueText />
                    </SelectTrigger>
                    <SelectContent>
                      {optionList.items.map((option) => (
                        <SelectItem item={option} key={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                  <Input
                    w={300}
                    value={search.keyword}
                    onChange={(e) =>
                      setSearch({ ...search, keyword: e.target.value })
                    }
                  />
                  <Button onClick={handleSearchClick}>검색</Button>
                </HStack>
              </Box>
              {authentication.isAuthenticated && (
                <Button onClick={handleWriteClick}>글 쓰기</Button>
              )}
            </HStack>
            {authentication.isAuthenticated || (
              <Box>
                <HStack>
                  로그인을 한 회원만 게시글 작성이 가능합니다.
                  <Button onClick={handleLoginClick}>로그인</Button>
                </HStack>
              </Box>
            )}
          </Box>
          <Box>
            <PaginationRoot
              count={countCommunity}
              pageSize={10}
              defaultPage={1}
              onPageChange={handlePageChangeClick}
              siblingCount={2}
            >
              <HStack>
                <PaginationPrevTrigger />
                <PaginationItems />
                <PaginationNextTrigger />
              </HStack>
            </PaginationRoot>
          </Box>
        </Stack>
      </div>
    </div>
  );
}

export default CommunityView;
