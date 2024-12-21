import React, { useContext, useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import axios from "axios";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import { Icon } from "@chakra-ui/react";
import { HiOutlineBookOpen } from "react-icons/hi";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { GoHeart } from "react-icons/go";
import { toaster } from "../../components/ui/toaster.jsx";
import { formattedDateTime } from "../../components/utils/FormattedDateTime.jsx";
import { Modal } from "../../components/root/Modal.jsx";

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
  const { hasAccessByNickName, isAdmin } = useContext(AuthenticationContext);
  const { pathname } = useLocation();
  const [titleLength, setTitleLength] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [likeModalOpen, setLikeModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/notice/view/${id}`, { id })
      .then((e) => {
        setNotice(e.data);
        setMyNoticeLike(e.data.myNoticeLike);
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
        navigate(`/notice/list`);
      });
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleDeleteClick = () => {
    axios
      .delete(`/api/notice/delete/${id}`)
      .then((e) => {
        const deleteSuccess = e.data.message;
        toaster.create({
          type: deleteSuccess.type,
          description: deleteSuccess.text,
        });
        navigate(`/notice/list`);
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
    navigate(`/notice/edit/${id}`);
  };

  const fetch = () => {
    axios
      .get(`/api/notice/fetch/${id}`)
      .then((res) => {
        setNotice(res.data);
        setMyNoticeLike(res.data.myNoticeLike);
      })
      .catch((err) => console.error(err));
  };

  function handleLoginClick() {
    navigate(`/member/login`);
  }

  const handleLikeClick = () => {
    axios
      .post(`/api/notice/like/${id}`)
      .then(() => {
        fetch();
      })
      .finally(() => setMyNoticeLike(!myNoticeLike));
  };

  function handleWriteClick() {
    navigate(`/notice/write`);
  }

  return (
    <div className={"notice"}>
      <Breadcrumb
        depth1={"공지사항"}
        navigateToDepth1={() => navigate(`/notice/list`)}
        depth2={
          titleLength > 15
            ? `${notice.title.substring(0, 15)}...`
            : notice.title
        }
        navigateToDepth2={() => navigate(`/notice/view/${notice.id}`)}
      />

      <div className={"body-normal"}>
        <h1>공지사항</h1>
        <h2>공지사항 외 문의는 문의 게시판을 이용해주세요.</h2>

        <div className={"btn-wrap"}>
          <button
            className={"btn btn-dark-outline"}
            onClick={() => navigate("/notice/list")}
          >
            목록
          </button>

          {authentication.isAuthenticated && (
            <div>
              {hasAccessByNickName(notice.writer) && (
                <button
                  className={"btn btn-dark-outline"}
                  onClick={() => setEditModalOpen(true)}
                >
                  수정
                </button>
              )}

              {hasAccessByNickName(notice.writer) && authentication.isAdmin && (
                <button
                  className={"btn btn-warning"}
                  onClick={() => setDeleteModalOpen(true)}
                >
                  삭제
                </button>
              )}

              {authentication.isAdmin && (
                <button className={"btn btn-dark"} onClick={handleWriteClick}>
                  글 쓰기
                </button>
              )}
            </div>
          )}
        </div>

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
                {myNoticeLike ? <IoMdHeart /> : <IoMdHeartEmpty />}
              </Icon>
            </li>
            <li>{notice.like}</li>
          </ul>
        </div>

        <table className={"table-view"}>
          <thead>
            <tr className={"thead-title"}>
              <th colSpan={2}>{notice.title}</th>
            </tr>
            <tr className={"thead-sub-title"}>
              <th>{notice.writer}</th>
              <th>{formattedDateTime(notice.creationDate)}</th>
            </tr>
            <tr className={"thead-sub-title"}>
              <th>
                <GoHeart /> {notice.numberOfLikes} |{" "}
              </th>
              <th>
                <HiOutlineBookOpen /> {notice.numberOfViews}
              </th>
            </tr>
            <tr>
              <th colSpan={2}>조회수 {notice.views}</th>
            </tr>
          </thead>

          <tbody>
            <tr className={"tbody-content"}>
              <td>{notice.content}</td>
            </tr>
          </tbody>
        </table>
        {/* 게시글 하단 조회수 표시됨*/}
        {/*<div>*/}
        {/*  <div>*/}
        {/*    <Field readOnly>*/}
        {/*      <HStack>*/}
        {/*        <Icon fontSize="2xl">*/}
        {/*          <HiOutlineBookOpen />*/}
        {/*        </Icon>{" "}*/}
        {/*        : {notice.views} | {creationDate}*/}
        {/*      </HStack>*/}
        {/*    </Field>*/}
        {/*  </div>*/}
        {/*</div>*/}
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
        onConfirm={handleLoginClick}
        message="로그인 한 회원만 게시글 추천이 가능합니다."
        buttonMessage="로그인"
      />
    </div>
  );
}

export default NoticeView;
