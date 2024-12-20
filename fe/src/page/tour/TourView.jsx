import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "../../components/ui/button.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import "./Tour.css";
import { Modal } from "../../components/root/Modal.jsx";
import ReviewContainer from "./ReviewContainer.jsx";
import { ImageSwipeView } from "../../components/Image/ImageSwipeView.jsx";
import { FaRegQuestionCircle } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { formatNumberWithCommas } from "../../components/utils/FormatNumberWithCommas.jsx";
import { IoIosArrowBack } from "react-icons/io";
import { Rating } from "../../components/ui/rating.jsx";

function TourView() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState({ cart: false });
  const [startDate, setStartDate] = useState("");
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const reviewRef = useRef(null);

  const { hasAccess, isAuthenticated, isAdmin } = useContext(
    AuthenticationContext,
  );
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#review") {
      setTimeout(() => {
        if (reviewRef.current) {
          reviewRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // 100ms 지연
    }
  }, []);

  useEffect(() => {
    if (!id) return; // id가 없으면 실행하지 않음
    axios.get(`/api/tour/view/${id}`).then((res) => setTour(res.data));
  }, [id]);

  if (tour === null) {
    return <p>존재하지 않는 상품 정보입니다.</p>;
  }

  const handleDeleteClick = () => {
    axios
      .delete(`/api/tour/delete/${tour.id}`)
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        navigate("/tour/list");
      })
      .catch((e) => {
        const data = e.response.data;
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
      })
      .finally(() => {
        setOpen(false);
      });
  };

  const handleAddToCartClick = () => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
    }
    axios
      .post(`/api/tour/cart`, {
        id: tour.id,
        email: tour.partnerEmail,
        cart: { startDate, endDate },
      })
      .then((res) => res.data)
      .then((data) => {
        setCart(data);
        setSaveModalOpen(true);
      })
      .catch((e) => {
        const data = e.response.data;
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
      });
  };

  const handleToListClick = () => {
    navigate("/tour/list");
  };

  return (
    <div className={"tour-view"}>
      <Breadcrumb
        depth1={"투어"}
        navigateToDepth1={() => navigate(`/tour/list`)}
        depth2={"상품 보기"}
        navigateToDepth2={() => navigate(`/tour/view/${id}`)}
      />

      <div className={"btn-wrap"}>
        <div className={"btn-back-wrap"}>
          <button className={"btn-back"} onClick={handleToListClick}>
            <IoIosArrowBack />
          </button>

          {/*관리 버튼*/}
          {(hasAccess(tour.partnerEmail) || isAdmin) && (
            <div className={"btn-admin"}>
              <button
                className={"btn btn-dark"}
                onClick={() => navigate(`/tour/update/${id}`)}
              >
                수정
              </button>
              <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
                <DialogTrigger>
                  <button className={"btn btn-warning"}>삭제</button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>삭제 확인</DialogTitle>
                  </DialogHeader>
                  <DialogBody>
                    <p>{tour.title} 게시물을 삭제하시겠습니까?</p>
                  </DialogBody>
                  <DialogFooter>
                    <DialogActionTrigger>
                      <Button>취소</Button>
                    </DialogActionTrigger>
                    <Button onClick={handleDeleteClick}>삭제</Button>
                  </DialogFooter>
                </DialogContent>
              </DialogRoot>
            </div>
          )}
        </div>
      </div>

      <div className={"body-normal"}>
        {tour.active ? (
          <div className="tour-view-container">
            <div className={"img"}>
              <ImageSwipeView files={tour.fileList} />
            </div>

            <ul className={"tour-view-list"}>
              <div className={"tour-view-header"}>
                <li className={"title"}>{tour.title}</li>

                <div className={"sub-title"}>
                  <li className={"product"}>{tour.product}</li>
                  <li className={"location"}>
                    <IoLocationSharp className={"icon"} />
                    {tour.location}
                  </li>
                </div>

                <li className={"review"}>
                  <Rating readOnly value={tour.rateAvg} allowHalf step={0.5} />
                  <span className={"review-count"}>
                    (리뷰 {tour.reviewCnt}개)
                  </span>
                </li>

                <li className={"price"}>
                  {formatNumberWithCommas(tour.price)}원
                </li>

                <li className={"cart"}>
                  <button
                    className="btn btn-blue"
                    disabled={!tour.active}
                    onClick={() => handleAddToCartClick()}
                  >
                    장바구니에 담기
                  </button>
                </li>
              </div>

              <div className="date-wrap">
                <h3>날짜 선택</h3>

                <div>
                  <label htmlFor="startDate">시작 날짜</label>
                  <input
                    type="date"
                    id="startDate"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="endDate">종료 날짜</label>
                  <input
                    type="date"
                    id="endDate"
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className={"tour-view-content"}>
                <li>{tour.content}</li>
              </div>

              <div className={"tour-view-footer"}>
                <li>여행사</li>
                <li>{tour.partner}</li>
              </div>
            </ul>
          </div>
        ) : (
          <div className="empty-container">
            <p>
              <FaRegQuestionCircle
                className="empty-container-icon"
                style={{ color: "#a1a1a8" }}
              />
            </p>
            <p className="empty-container-title">운영이 종료된 상품입니다.</p>
            <p className="empty-container-description">
              다른 상품을 선택해주세요.
            </p>
          </div>
        )}

        <div ref={reviewRef} className={"tour-review-container"}>
          <ReviewContainer tourId={tour.id} />
        </div>

        {/*장바구니 추가 modal*/}
        <Modal
          isOpen={saveModalOpen}
          onClose={() => setSaveModalOpen(false)}
          onConfirm={() => navigate(`/cart`)}
          message={"장바구니에 상품을 담았습니다."}
          buttonMessage={"장바구니로 가기"}
        />
        {/* 로그아웃 상황에서 장바구니 추가 modal */}
        <Modal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onConfirm={() => navigate(`/member/login`)}
          message={"로그인 후 사용 가능합니다."}
          buttonMessage={"로그인 페이지로"}
        />
      </div>
    </div>
  );
}

export default TourView;
