import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import "./Wallet.css";

function WalletList(props) {
  const [walletList, setWalletList] = useState([]); // 전체 지갑 리스트
  const [currentMonth, setCurrentMonth] = useState(); // 현재 월
  const [selectedDate, setSelectedDate] = useState(); // 선택된 날짜
  const [filteredWallet, setFilteredWallet] = useState([]); // 필터링된 지갑 리스트
  const [addModalOpen, setAddModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/wallet/list").then((res) => setWalletList(res.data));

    // 현재 월 가져오기
    const today = new Date();
    const month = today.toLocaleString("default", { month: "long" }); // 예: "December"
    const year = today.getFullYear(); // 예: 2024
    setCurrentMonth(`${year}년 ${month}`); // 예: "2024년 December"
  }, []);

  // 선택된 날짜가 변경될 때 필터링
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString("en-CA"); // 현지 시간대에 맞는 날짜 형식 (yyyy-MM-dd)
      const filtered = walletList.filter(
        (wallet) =>
          formattedDate >= wallet.date && formattedDate <= wallet.date, // 필터링 기준을 선택된 날짜와 비교
      );
      setFilteredWallet(filtered);
    } else {
      setFilteredWallet(walletList); // 날짜 선택 안 하면 전체 내역 표시
    }
  }, [selectedDate, walletList]);

  // 선택된 날짜 업데이트
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // 선택된 날짜에 해당하는 소비 금액 합산
  const getTotalExpenseForDate = (date) => {
    const formattedDate = date.toLocaleDateString("en-CA"); // 현지 시간대에 맞는 날짜 형식 (yyyy-MM-dd)
    const matchingWallets = walletList.filter(
      (wallet) => wallet.date === formattedDate,
    );
    const totalExpense = matchingWallets.reduce(
      (total, wallet) => total + wallet.expense,
      0,
    );
    return totalExpense;
  };

  // 3자리마다 쉼표 추가
  const formatNumberWithCommas = (number) => {
    return number.toLocaleString(); // 3자리마다 쉼표 추가
  };

  // 월별 보기 버튼 클릭 처리
  const handleMonthView = () => {
    if (selectedDate) {
      const month = selectedDate.getMonth(); // 선택된 월
      const year = selectedDate.getFullYear(); // 선택된 연도

      const filtered = walletList.filter((wallet) => {
        const walletDate = new Date(wallet.date); // wallet.date를 Date 객체로 변환
        return (
          walletDate.getMonth() === month && walletDate.getFullYear() === year
        );
      });
      setFilteredWallet(filtered); // 월별 필터링된 지갑 리스트 설정
    } else {
      setFilteredWallet(walletList); // 선택된 날짜가 없다면 전체 지갑 리스트 표시
    }
  };

  const closeModal = () => {
    setAddModalOpen(false);
  };

  return (
    <div className={"calendar-list"}>
      <aside className={"calendar"}>
        <Calendar
          formatDay={(locale, date) =>
            date.toLocaleString("en", { day: "numeric" })
          }
          showNeighboringMonth={false}
          onChange={handleDateChange} // 날짜 선택 이벤트 핸들러
          value={selectedDate} // 선택된 날짜 상태와 동기화
          // 선택된 날짜에 해당하는 소비 금액을 표시
          tileContent={({ date }) => {
            const totalExpense = getTotalExpenseForDate(date);

            return totalExpense > 0 ? (
              <div className={"calendar-badge"}>
                {formatNumberWithCommas(totalExpense)}
              </div>
            ) : null;
          }}
        />
      </aside>

      <div className={"day-list"}>
        <div className={"fixed-search-wrap"}>
          <button
            className={"btn btn-dark btn-day-list"}
            onClick={() => setAddModalOpen(true)}
          >
            추가
          </button>

          <button
            className={"btn btn-dark btn-day-list"}
            style={{ marginLeft: "15px" }}
            onClick={handleMonthView}
          >
            월별 보기
          </button>

          <button
            className={"btn btn-dark btn-day-list"}
            style={{ marginLeft: "15px" }}
            onClick={() => setFilteredWallet(walletList)}
          >
            전체 보기
          </button>
        </div>

        <table className={"table-list wallet-table"}>
          <caption>{currentMonth}</caption>

          <thead>
            <tr>
              <th>날짜</th>
              <th>항목</th>
              <th>사용처</th>
              <th>수입</th>
              <th>지출</th>
              <th>지출 방식</th>
              <th>잔액</th>
              <th>메모</th>
            </tr>
          </thead>

          <tbody>
            {filteredWallet.map((wallet) => (
              <tr
                key={wallet.id}
                onClick={() => navigate(`/wallet/view/${wallet.id}`)}
                className={"pointer"}
              >
                <td>{wallet.date}</td>
                <td>{wallet.category}</td>
                <td>{wallet.title}</td>
                <td>{wallet.income}</td>
                <td>{wallet.expense}</td>
                <td>{wallet.income - wallet.expense}</td>
                <td>{wallet.paymentMethod}</td>
                <td>{wallet.memo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 추가 modal */}
      {addModalOpen && (
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
              <p>새로운 내역을 추가하시겠습니까?</p>
            </div>

            <div className={"modal-footer btn-wrap"}>
              <button className={"btn btn-dark-outline"} onClick={closeModal}>
                닫기
              </button>

              <button
                className={"btn btn-dark"}
                onClick={() => navigate(`/wallet/add`)}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletList;
