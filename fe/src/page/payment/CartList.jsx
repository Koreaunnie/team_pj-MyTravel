import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { LuShoppingCart } from "react-icons/lu";
import "./Cart.css";
import { formatNumberWithCommas } from "../../components/utils/FormatNumberWithCommas.jsx";

function CartList() {
  const [cartList, setCartList] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthenticationContext);

  useEffect(() => {
    axios.get("/api/cart/list").then((res) => setCartList(res.data));
  }, []);

  if (!isAuthenticated) {
    return (
      <div>
        <h1>장바구니 목록</h1>
        로그인 후 사용 가능합니다.
        <a href="/member/login">로그인 페이지로 </a>
        <a href="/member/signup">회원 가입 페이지로</a>
      </div>
    );
  }

  function handleRowClick(id) {
    navigate(`/tour/view/${id}`);
  }

  const handleDeleteClick = (id, cart) => {
    axios
      .delete(`/api/cart/delete/${id}`)
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        setCartList((prevList) => prevList.filter((c) => c.id !== id));
        setCheckedList(checkedList.filter((r) => r.product !== cart.product));
      })
      .catch((e) => {
        const data = e.response.data;
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
      });
  };

  function handleCheckboxChange(cart) {
    if (checkedList.includes(cart)) {
      setCheckedList(checkedList.filter((r) => r.product !== cart.product));
    } else {
      setCheckedList([...checkedList, cart]);
    }
  }

  function handlePayButton() {
    if (checkedList.length === 0) {
      toaster.create({
        type: "error",
        description: "결제할 항목을 선택해 주세요.",
      });
      return;
    }
    //창 이동 + 정보 전달
    navigate(`/payment`, { state: { tour: checkedList } });
  }

  // checkedList의 price 합산 함수
  const calculateTotalPrice = () => {
    return checkedList.reduce((sum, cart) => sum + cart.price, 0);
  };

  function handleDeleteAll() {
    //checkList의 모든 항목 cartList에서 삭제
    const deletePromise = checkedList.map((cart) =>
      axios.delete(`/api/cart/delete/${cart.id}`),
    );

    Promise.all(deletePromise)
      .then(() => {
        setCartList((prev) =>
          prev.filter((cart) => !checkedList.includes(cart)),
        );
        setCheckedList([]);
        toaster.create({
          type: "success",
          description: "선택한 항목이 삭제되었습니다.",
        });
      })
      .catch((e) => {
        const data = e.response?.data;
        toaster.create({
          type: "error",
          description: "오류로 인해 삭제할 수 없습니다.",
        });
      });
  }

  const isCartEmpty = !cartList || cartList.length === 0;

  return (
    <div className={"cart-list"}>
      <div className={"body-wide"}>
        <h1>장바구니</h1>

        {isCartEmpty ? (
          <div className={"empty-container"}>
            <p>
              <LuShoppingCart
                className={"empty-container-icon"}
                style={{ color: "#a1a1a8" }}
              />
            </p>
            <p className={"empty-container-title"}>장바구니가 비었습니다.</p>
            <p className={"empty-container-description"}>
              투어 상품을 담아주세요.
            </p>
          </div>
        ) : (
          <div>
            <table className={"table-list"}>
              <thead>
                <tr>
                  <th colSpan={5}>상품</th>
                  <th colSpan={3}>가격</th>
                </tr>
              </thead>
              <tbody>
                {cartList.map((cart) => (
                  <tr key={cart.id} onClick={() => handleRowClick(cart.id)}>
                    <td>
                      <input
                        type={"checkbox"}
                        checked={checkedList.some(
                          (r) => r.product === cart.product,
                        )}
                        onClick={(e) => e.stopPropagation()} // 이벤트 전파 막기
                        onChange={() => handleCheckboxChange(cart)}
                      />
                    </td>
                    <td>
                      <img key={cart.image} src={cart.src} />
                    </td>
                    <td>{cart.product}</td>
                    <td>
                      <span>{cart.location}</span>
                      <br />
                      {cart.title}
                    </td>
                    <td></td>
                    <td>{formatNumberWithCommas(cart.price)}</td>
                    <td>
                      {cart.startDate} ~ {cart.endDate}
                    </td>
                    <td className={"btn-delete"}>
                      <button
                        className={"btn btn-warning"}
                        key={cart.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(cart.id, cart);
                        }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {cartList.length > 0 && checkedList.length > 0 && (
          <div className={"selected-cart-list"}>
            <h1>선택한 제품</h1>

            <div>
              <table className={"table-list"}>
                <thead>
                  <tr>
                    <th>상품</th>
                    <th>가격</th>
                  </tr>
                </thead>
                <tbody>
                  {checkedList.map((cart) => (
                    <tr>
                      <td>{cart.product}</td>
                      <td>{formatNumberWithCommas(cart.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={"btn-wrap"}>
              <button className={"btn btn-dark"} onClick={handlePayButton}>
                총 {formatNumberWithCommas(calculateTotalPrice())}원 결제
              </button>
              <button className={"btn btn-warning"} onClick={handleDeleteAll}>
                선택 삭제
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartList;
