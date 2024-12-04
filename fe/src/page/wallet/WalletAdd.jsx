import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { Modal } from "../../components/root/Modal.jsx";

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
  const [handleAddCategoryOpen, setHandleAddCategoryOpen] = useState(false);

  // 폼 상태 관리
  const [date, setDate] = useState("");
  const [category, setCategory] = useState(categoryOptions[0]);
  const [title, setTitle] = useState("");
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [memo, setMemo] = useState("");

  const navigate = useNavigate();

  // 새 카테고리 추가
  const handleAddCategory = () => {
    if (newCategory.trim() && !categoryOptions.includes(newCategory)) {
      setCategoryOptions([...categoryOptions, newCategory]);
      setNewCategory("");
      setHandleAddCategoryOpen(false);
      setCategory(newCategory);
    }
  };

  // 저장 버튼 핸들러
  const handleSaveButton = (event) => {
    // 필드 검증
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
          className={"btn btn-dark-outline"}
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
        <table className={"form-table"}>
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

                <button
                  type="button"
                  className={"btn btn-dark"}
                  onClick={() =>
                    setHandleAddCategoryOpen(!handleAddCategoryOpen)
                  }
                >
                  {handleAddCategoryOpen ? "닫기" : "항목 추가"}
                </button>

                {handleAddCategoryOpen && (
                  <div className={"btn-wrap"}>
                    <input
                      type="text"
                      placeholder="새로운 항목을 입력해주세요."
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button
                      type="button"
                      className={"btn-search btn-dark"}
                      onClick={handleAddCategory}
                    >
                      &#43;
                    </button>
                  </div>
                )}
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
      <Modal
        isOpen={backToListModalOpen}
        onClose={() => setBackToListModalOpen(false)}
        onConfirm={() => navigate(`/wallet/list`)}
        message="목록으로 돌아가면 작성한 내용이 사라집니다."
        buttonMessage="목록"
      />

      {/* 저장 modal */}
      <Modal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onConfirm={handleSaveButton}
        message="저장하시겠습니까?"
        buttonMessage="저장"
      />
    </div>
  );
}

export default WalletAdd;
