import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";
import { toaster } from "../../components/ui/toaster.jsx";

function WalletEdit(props) {
  const { id } = useParams();
  const [wallet, setWallet] = useState(null);

  // categoryOptions를 서버에서 가져온 값으로 초기화
  const [categoryOptions, setCategoryOptions] = useState([
    "식비",
    "교통비",
    "여가비",
    "기타",
  ]);
  const [newCategory, setNewCategory] = useState("");

  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [memo, setMemo] = useState("");
  const [category, setCategory] = useState(categoryOptions[0]);

  const [backToListModalOpen, setBackToListModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // wallet 정보 및 categoryOptions 가져오기
    axios.get(`/api/wallet/view/${id}`).then((res) => {
      setWallet(res.data);
      setCategoryOptions(res.data.categoryOptions || []); // 카테고리 옵션 설정
      setCategory(res.data.category);
      setDate(res.data.date);
      setTitle(res.data.title);
      setIncome(res.data.income);
      setExpense(res.data.expense);
      setPaymentMethod(res.data.paymentMethod);
      setMemo(res.data.memo);
    });
  }, [id]);

  if (wallet === null) {
    return <Spinner />;
  }

  // 새 카테고리 추가
  const handleAddCategory = () => {
    if (newCategory.trim() && !categoryOptions.includes(newCategory)) {
      setCategoryOptions([...categoryOptions, newCategory]);
      setNewCategory("");
    }
  };

  function handleSaveButton() {
    axios
      .put(`/api/wallet/update/${id}`, {
        date: wallet.date,
        category: category, // 선택된 카테고리 값
        title: title,
        income: income,
        expense: expense,
        paymentMethod: paymentMethod,
        memo: memo,
      })
      .then((res) => res.data)
      .then((data) => {
        setSaveModalOpen(true);
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        navigate(`/wallet/list`);
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally();
  }

  function handleDeleteButton() {
    axios.delete(`/api/wallet/delete/${id}`).then((res) => {
      navigate(`/wallet/list`);
      alert("내역이 삭제되었습니다.");
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "date":
        setDate(value);
        break;
      case "title":
        setTitle(value);
        break;
      case "income":
        setIncome(value);
        break;
      case "expense":
        setExpense(value);
        break;
      case "paymentMethod":
        setPaymentMethod(value);
        break;
      case "memo":
        setMemo(value);
        break;
      case "category":
        setCategory(value);
        break;
      default:
        break;
    }
  };

  const closeModal = () => {
    setBackToListModalOpen(false);
    setSaveModalOpen(false);
    setDeleteModalOpen(false);
  };

  return (
    <div className={"body"}>
      <div>
        <button
          className={"btn btn-dark"}
          onClick={() => setBackToListModalOpen(true)}
        >
          목록
        </button>

        <button
          className={"btn btn-warning"}
          onClick={() => setDeleteModalOpen(true)}
        >
          삭제
        </button>
      </div>

      <form>
        <table>
          <tbody>
            <tr>
              <th>
                <label htmlFor="date">날짜</label>
              </th>
              <td>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={date}
                  onChange={handleChange}
                />
              </td>
            </tr>

            <tr>
              <th>
                <label htmlFor="category">항목</label>
              </th>
              <td>
                <select
                  name="category"
                  id="category"
                  value={category}
                  onChange={handleChange}
                >
                  {categoryOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <br />
                <input
                  type="text"
                  placeholder="새로운 항목을 추가하고 싶으면 입력해주세요."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button
                  type="button"
                  className={"btn"}
                  onClick={handleAddCategory}
                >
                  항목 추가
                </button>
              </td>
            </tr>

            <tr>
              <th>
                <label htmlFor="title">사용처</label>
              </th>
              <td>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  onChange={handleChange}
                />
              </td>
            </tr>

            <tr>
              <th>
                <label htmlFor="income">수입</label>
              </th>
              <td>
                <input
                  type="number"
                  name="income"
                  id="income"
                  value={income}
                  onChange={handleChange}
                />
              </td>
            </tr>

            <tr>
              <th>
                <label htmlFor="expense">지출</label>
              </th>
              <td>
                <input
                  type="number"
                  name="expense"
                  id="expense"
                  value={expense}
                  onChange={handleChange}
                />
              </td>
            </tr>

            <tr>
              <th>
                <label htmlFor="paymentMethod">지출 방식</label>
              </th>
              <td>
                <select
                  name="paymentMethod"
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={handleChange}
                >
                  <option value="cash">현금</option>
                  <option value="card">카드</option>
                  <option value="bankTransfer">계좌이체</option>
                  <option value="other">기타</option>
                </select>
              </td>
            </tr>

            <tr>
              <th>
                <label htmlFor="memo">메모</label>
              </th>
              <td>
                <textarea
                  name="memo"
                  id="memo"
                  rows="3"
                  value={memo}
                  onChange={handleChange}
                ></textarea>
              </td>
            </tr>
          </tbody>

          <div className={"btn-wrap"}>
            <button
              className={"btn btn-dark"}
              type="button"
              onClick={() => setSaveModalOpen(true)}
            >
              저장
            </button>
          </div>
        </table>
      </form>

      {/* 목록 modal */}
      {backToListModalOpen && (
        <div className={"modal"}>
          <div className={"modal-content"}>
            <div className={"modal-header"}>
              <button
                className="close"
                onClick={closeModal}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>

            <div className={"modal-body"}>
              <p>목록으로 돌아가시겠습니까?</p>
            </div>

            <div className={"modal-footer btn-wrap"}>
              <button className={"btn btn-dark-outline"} onClick={closeModal}>
                닫기
              </button>

              <button
                className={"btn btn-dark"}
                onClick={() => navigate(`/wallet/list`)}
              >
                목록
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 저장 modal */}
      {saveModalOpen && (
        <div className={"modal"}>
          <div className={"modal-content"}>
            <div className={"modal-header"}>
              <button
                className="close"
                onClick={closeModal}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>

            <div className={"modal-body"}>
              <p>저장하시겠습니까?</p>
            </div>

            <div className={"modal-footer btn-wrap"}>
              <button className={"btn btn-dark-outline"} onClick={closeModal}>
                닫기
              </button>

              <button className={"btn btn-dark"} onClick={handleSaveButton}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 modal */}
      {deleteModalOpen && (
        <div className={"modal"}>
          <div className={"modal-content"}>
            <div className={"modal-header"}>
              <button
                className="close"
                onClick={closeModal}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>

            <div className={"modal-body"}>
              <p>내역을 삭제하시겠습니까?</p>
            </div>

            <div className={"modal-footer btn-wrap"}>
              <button className={"btn btn-dark-outline"} onClick={closeModal}>
                닫기
              </button>

              <button
                className={"btn btn-warning"}
                onClick={handleDeleteButton}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletEdit;
