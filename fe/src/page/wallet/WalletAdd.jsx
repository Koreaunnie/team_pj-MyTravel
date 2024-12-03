import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";

function WalletAdd(props) {
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [backToListModalOpen, setBackToListModalOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([
    "식비",
    "교통비",
    "여가비",
    "기타",
  ]);
  const [newCategory, setNewCategory] = useState("");

  // 폼 상태 관리
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [memo, setMemo] = useState("");
  const [category, setCategory] = useState(categoryOptions[0]);

  const navigate = useNavigate();

  // 새 카테고리 추가
  const handleAddCategory = () => {
    if (newCategory.trim() && !categoryOptions.includes(newCategory)) {
      setCategoryOptions([...categoryOptions, newCategory]);
      setNewCategory("");
    }
  };

  // 저장 버튼 핸들러
  const handleSaveButton = (event) => {
    // date가 null 또는 빈 값이면 경고 메시지 출력하고 저장하지 않음
    if (!date) {
      alert("날짜를 입력해주세요.");
      setSaveModalOpen(false);
      return;
    }

    axios
      .post(`/api/wallet/add`, {
        date,
        category,
        title,
        income,
        expense,
        paymentMethod,
        memo,
      })
      .then((response) => response.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        navigate(`/wallet/list`);
      })
      .catch()
      .finally();
  };

  const closeModal = () => {
    setSaveModalOpen(false);
    setBackToListModalOpen(false);
  };

  return (
    <div className={"body"}>
      <div className={"btn-wrap"}>
        <button
          className={"btn btn-dark"}
          onClick={() => setBackToListModalOpen(true)}
        >
          목록
        </button>

        <button
          type="submit"
          className={"btn btn-dark"}
          onClick={() => {
            setSaveModalOpen(true);
          }}
        >
          저장
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
                  onChange={(e) => setDate(e.target.value)}
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
                  onChange={(e) => setCategory(e.target.value)}
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
                  onChange={(e) => setTitle(e.target.value)}
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
                  onChange={(e) => setIncome(e.target.value)}
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
                  onChange={(e) => setExpense(e.target.value)}
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
                  onChange={(e) => setPaymentMethod(e.target.value)}
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
                  onChange={(e) => setMemo(e.target.value)}
                ></textarea>
              </td>
            </tr>
          </tbody>
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
    </div>
  );
}

export default WalletAdd;
