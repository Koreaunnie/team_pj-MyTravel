import React, { useState } from "react";
import axios from "axios";

function WalletAdd(props) {
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
      .then((response) => {
        console.log("저장 성공:", response.data);
      })
      .catch()
      .finally();
  };

  return (
    <div className={"body"}>
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

          <div className={"btn-wrap"}>
            <button
              type="submit"
              className={"btn btn-dark"}
              onClick={handleSaveButton}
            >
              저장
            </button>
          </div>
        </table>
      </form>
    </div>
  );
}

export default WalletAdd;
