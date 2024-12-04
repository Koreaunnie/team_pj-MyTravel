import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";
import { toaster } from "../../components/ui/toaster.jsx";
import { Modal } from "../../components/root/Modal.jsx";

function WalletEdit(props) {
  const { id } = useParams();
  const [wallet, setWallet] = useState(null);

  // categoryOptions를 서버에서 가져온 값으로 초기화
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [handleAddCategoryOpen, setHandleAddCategoryOpen] = useState(false);

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
    async function fetchData() {
      try {
        // 카테고리 목록 가져오기
        const categoriesResponse = await axios.get(`/api/wallet/categories`);
        setCategoryOptions(categoriesResponse.data);

        // 상세 정보 가져오기
        const walletResponse = await axios.get(`/api/wallet/view/${id}`);
        const walletData = walletResponse.data;
        setWallet(walletData);

        setCategory(walletData.category || categoriesResponse.data[0]); // 기본 카테고리 설정
        setDate(walletData.date);
        setTitle(walletData.title);
        setIncome(walletData.income);
        setExpense(walletData.expense);
        setPaymentMethod(walletData.paymentMethod);
        setMemo(walletData.memo);
      } catch (error) {
        console.error("데이터를 가져오는 중 문제가 발생했습니다:", error);
      }
    }

    fetchData();
  }, [id]);

  if (wallet === null) {
    return <Spinner />;
  }

  // 새 카테고리 추가
  const handleAddCategory = () => {
    if (newCategory.trim() && !categoryOptions.includes(newCategory)) {
      setCategoryOptions([...categoryOptions, newCategory]);
      setNewCategory("");
      setHandleAddCategoryOpen(false);
      setCategory(newCategory);
    }
  };

  // 기존 카테고리 삭제
  const handleDeleteCategory = () => {
    if (categoryOptions.includes(category)) {
      // 선택된 카테고리를 제외한 새로운 배열 생성
      const updatedCategories = categoryOptions.filter(
        (opt) => opt !== category,
      );
      setCategoryOptions(updatedCategories);

      // 삭제 후 첫 번째 항목으로 기본 선택
      setCategory(updatedCategories[0] || ""); // 빈 배열이면 빈 문자열 설정

      toaster.create({
        type: "success",
        description: `"${category}" 항목이 삭제되었습니다.`,
      });
    } else {
      toaster.create({
        type: "warning",
        description: "삭제하려는 항목이 존재하지 않습니다.",
      });
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
      <div className={"btn-wrap"}>
        <button
          className={"btn btn-dark-outline"}
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

        <button
          className={"btn btn-dark"}
          type="button"
          onClick={() => setSaveModalOpen(true)}
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

                <button
                  type="button"
                  className={"btn btn-dark"}
                  onClick={() =>
                    setHandleAddCategoryOpen(!handleAddCategoryOpen)
                  }
                >
                  {handleAddCategoryOpen ? "닫기" : "항목 추가"}
                </button>

                <button
                  type="button"
                  className={"btn btn-warning"}
                  onClick={handleDeleteCategory}
                >
                  항목 삭제
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

      {/* 목록 modal */}
      <Modal
        isOpen={backToListModalOpen}
        onClose={() => setBackToListModalOpen(false)}
        onConfirm={() => navigate(`/wallet/list`)}
        message="목록으로 돌아가면 작성한 내용이 사라집니다."
        buttonMessage="목록"
      />

      {/* 삭제 modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteButton}
        message="정말로 삭제하시겠습니까?"
        buttonMessage="삭제"
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

export default WalletEdit;
