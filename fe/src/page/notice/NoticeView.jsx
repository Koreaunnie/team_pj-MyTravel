import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import axios from "axios";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import {
  Box,
  createListCollection,
  HStack,
  Icon,
  Input,
  Stack,
  Table,
  Textarea,
} from "@chakra-ui/react";
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
import { GoHeart } from "react-icons/go";
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

function NoticeView(props) {
  const { id } = useParams();
  const [notice, setNotice] = useState({});
  const [myNoticeLike, setMyNoticeLike] = useState(false);
  const [noticeList, setNoticeList] = useState([]);
  const [search, setSearch] = useState({ type: "all", keyword: "" });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countNotice, setCountNotice] = useState("");
  const authentication = useContext(AuthenticationContext);
  const { hasAccessByNickName } = useContext(AuthenticationContext);

  useEffect(() => {
    axios.get(`/api/notice/view/${id}`, { id }).then((e) => {
      setNotice(e.data);
      setMyNoticeLike(e.data.myNoticeLike);
    });
  }, []);

  useEffect(() => {
    axios.get(`/api/notice/list?${searchParams.toString()}`).then((res) => {
      setNoticeList(res.data.list);
      setCountNotice(res.data.countNotice);
    });
  }, [searchParams]);

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

  function handleWriteClick() {
    navigate(`/notice/write`);
  }

  function handleViewClick(id) {
    axios.get(`/api/notice/view/${id}`).then((e) => setNotice(e.data));
  }

  function handleSearchClick() {
    const searchInfo = { type: search.type, keyword: search.keyword };
    const searchQuery = new URLSearchParams(searchInfo);
    navigate(`/notice/list?${searchQuery.toString()}`);
  }

  function handlePageChangeClick(e) {
    const pageNumber = { page: e.page };
    const pageQuery = new URLSearchParams(pageNumber);
    const searchInfo = { type: search.type, keyword: search.keyword };
    const searchQuery = new URLSearchParams(searchInfo);
    // const pageURL = new URL(`http://localhost:5173/community/list?${pageQuery.toString()}`);
    navigate(`/notice/list?${searchQuery.toString()}&${pageQuery.toString()}`);
  }

  const optionList = createListCollection({
    items: [
      { label: "전체", value: "all" },
      { label: "제목", value: "title" },
      { label: "본문", value: "content" },
      { label: "작성자", value: "writer" },
    ],
  });

  return (
    <div>
      <Breadcrumb
        depth1={"공지사항"}
        navigateToDepth1={() => navigate(`/notice/list`)}
        depth2={notice.id + "번 공지사항"}
        navigateToDepth2={() => navigate(`/notice/view/${id}`)}
      />
      <div>
        <br />
        <br />
        <h1>{notice.title}</h1>
        <Stack>
          <Box>
            <Field readOnly>
              <HStack>
                <Icon fontSize="2xl">
                  <HiOutlineBookOpen />
                </Icon>{" "}
                : {notice.views} | {notice.creationDate}
              </HStack>
            </Field>
            <br />
            <Field readOnly>
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
          <Stack>
            <Box>
              <h1>공지사항</h1>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>제목</Table.ColumnHeader>
                    <Table.ColumnHeader>작성자</Table.ColumnHeader>
                    <Table.ColumnHeader>작성일시</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {noticeList.map((n) => (
                    <Table.Row onClick={() => handleViewClick(n.id)} key={n.id}>
                      <Table.Cell>
                        <Stack>
                          <h3>{n.title}</h3>
                          <h4>
                            <HStack>
                              <GoHeart /> {n.numberOfLikes} |{" "}
                              <HiOutlineBookOpen /> {n.numberOfViews}
                            </HStack>
                          </h4>
                        </Stack>
                      </Table.Cell>
                      <Table.Cell>{n.writer}</Table.Cell>
                      <Table.Cell>{n.creationDate}</Table.Cell>
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
                {authentication.isAdmin && (
                  <Button onClick={handleWriteClick}>글 쓰기</Button>
                )}
              </HStack>
            </Box>
            <Box>
              <PaginationRoot
                count={countNotice}
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
            <br />
          </Stack>
        </Stack>
      </div>
    </div>
  );
}

export default NoticeView;
