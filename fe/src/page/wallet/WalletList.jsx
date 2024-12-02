import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";

function WalletList(props) {
  const [walletList, setWalletList] = useState([]); // 전체 지갑 리스트
  const [selectedDate, setSelectedDate] = useState(); // 선택된 날짜
  const [filteredWallet, setFilteredWallet] = useState([]); // 필터링된 지갑 리스트
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/wallet/list").then((res) => setWalletList(res.data));
  }, []);

  // 선택된 날짜가 변경될 때 필터링
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // yyyy-MM-dd 형식
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
    const formattedDate = date.toISOString().split("T")[0];
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
        <button className={"btn btn-dark"}>전체 보기</button>
        <button
          className={"btn btn-dark"}
          onClick={() => navigate(`/wallet/add`)}
        >
          추가
        </button>

        <table>
          <thead>
            <tr>
              <th>date</th>
              <th>category</th>
              <th>title</th>
              <th>income</th>
              <th>expense</th>
              <th>balance</th>
              <th>method</th>
              <th>memo</th>
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
    </div>
  );
}

export default WalletList;
