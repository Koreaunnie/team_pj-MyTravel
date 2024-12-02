import React, { useState } from "react";

function WalletAdd(props) {
  const [categoryOptions, setCategoryOptions] = useState([
    "식비",
    "교통비",
    "여가비",
    "기타",
  ]);

  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim() && !categoryOptions.includes(newCategory)) {
      setCategoryOptions([...categoryOptions, newCategory]);
      setNewCategory("");
    }
  };

  return (
    <div className={"body"}>
      <form action="">
        <table>
          <tbody>
            <tr>
              <th>날짜</th>
              <td>
                <input type="date" name="date" />
              </td>
            </tr>

            <tr>
              <th>항목</th>
              <td>
                <select name="category">
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
              <th>사용처</th>
              <td>
                <input type="text" name="title" />
              </td>
            </tr>

            <tr>
              <th>수입</th>
              <td>
                <input type="number" name="income" />
              </td>
            </tr>

            <tr>
              <th>지출</th>
              <td>
                <input type="number" name="expense" />
              </td>
            </tr>

            <tr>
              <th>지출 방식</th>
              <td>
                <select name="method">
                  <option value="cash">카드</option>
                  <option value="card">현금</option>
                  <option value="bankTransfer">계좌이체</option>
                  <option value="bankTransfer">기타</option>
                </select>
              </td>
            </tr>

            <tr>
              <th>메모</th>
              <td>
                <textarea name="memo" rows="3"></textarea>
              </td>
            </tr>

            <div className={"btn-wrap"}>
              <button type="submit" className={"btn btn-dark"}>
                저장
              </button>
            </div>
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default WalletAdd;
