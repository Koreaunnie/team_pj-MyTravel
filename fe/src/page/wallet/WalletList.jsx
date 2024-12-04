import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import "./Wallet.css";
import { Modal } from "../../components/root/Modal.jsx";

function WalletList(props) {
  const [walletList, setWalletList] = useState([]); // 전체 지갑 리스트
  const [currentMonth, setCurrentMonth] = useState(); // 현재 월
  const [selectedDate, setSelectedDate] = useState(); // 선택된 날짜
  const [filteredWallet, setFilteredWallet] = useState([]); // 필터링된 지갑 리스트
  const [isAllView, setIsAllView] = useState(true); // 전체 보기 상태
  const [activeTab, setActiveTab] = useState(null); // 카테고리 탭 활성화
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
      const formattedDate = selectedDate.toLocaleDateString("en-CA");
      const filtered = walletList.filter(
        (wallet) => wallet.date === formattedDate,
      );
      setFilteredWallet(filtered);
      setIsAllView(false); // 날짜 선택 시 전체 보기 해제
    } else {
      setFilteredWallet(walletList); // 날짜 선택 안 하면 전체 내역 표시
    }
  }, [selectedDate, walletList]);

  // 전체 날짜 보기
  const handleAllView = () => {
    setFilteredWallet(walletList);
    setIsAllView(true);
  };

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

  const categories = ["전체", "식비", "교통비", "여가비", "기타"];

  // 카테고리 탭 활성화
  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  // 총 지출 계산
  const getTotalExpense = () => {
    return walletList.reduce((total, wallet) => total + wallet.expense, 0);
  };

  // 총 수입 계산
  const getTotalIncome = () => {
    return walletList.reduce((total, wallet) => total + wallet.income, 0);
  };

  // 해당 하는 날짜
  const getFilteredDate = () => {
    if (filteredWallet.length > 0) {
      return filteredWallet[0].date; // 첫 번째 항목의 날짜 반환
    }
    return ""; // 필터링된 리스트가 없으면 빈 문자열 반환
  };

  // 해당 하는 날짜의 일별 지출 계산
  const getOneDayExpense = () => {
    return filteredWallet.reduce((total, wallet) => total + wallet.expense, 0);
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
        <div className={"fixed-list-head-wrap"}>
          <div className={"btn-wrap"}>
            <button
              className={"btn btn-dark"}
              onClick={() => setAddModalOpen(true)}
            >
              추가
            </button>

            <button
              className={"btn btn-dark-outline"}
              style={{ marginLeft: "15px" }}
              onClick={handleAllView}
            >
              전체 보기
            </button>

            <button
              className={"btn btn-dark-outline"}
              style={{ marginLeft: "15px" }}
              onClick={handleMonthView}
            >
              월별 보기
            </button>
          </div>

          <h1>{currentMonth}</h1>

          <div className={"category-tab"}>
            <ul>
              {categories.map((category, index) => (
                <li
                  key={index}
                  className={`category-tab ${activeTab === index ? "on" : ""}`}
                  onClick={() => handleTabClick(index)} // 탭 클릭 시 해당 인덱스를 설정
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <table className={"table-list"}>
          <thead>
            <td>
              <th>총 지출</th>
              <td colSpan={7}>{formatNumberWithCommas(getTotalExpense())}</td>
            </td>

            <tr>
              <th>총 수입</th>
              <td colSpan={7}>{formatNumberWithCommas(getTotalIncome())}</td>
            </tr>
          </thead>
        </table>

        <table className={"table-list"}>
          <thead>
            <tr>
              <th>날짜</th>
              <th>항목</th>
              <th>사용처</th>
              <th>수입</th>
              <th>지출</th>
              <th>지출 방식</th>
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
                <td>{wallet.paymentMethod}</td>
                <td>{wallet.memo}</td>
              </tr>
            ))}
          </tbody>

          {/* 전체 보기 상태가 아닐 때만 tfoot 렌더링 */}
          {!isAllView && (
            <tfoot>
              <tr>
                <th>{getFilteredDate()} 하루 총 지출</th>
                <td colSpan={7}>
                  {formatNumberWithCommas(getOneDayExpense())}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* 추가 modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={() => navigate(`/wallet/add`)}
        message="내역을 추가하시겠습니까?"
        buttonMessage="추가"
      />
    </div>
  );
}

export default WalletList;
