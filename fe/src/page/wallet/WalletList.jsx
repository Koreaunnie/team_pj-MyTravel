import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import "./Wallet.css";
import { Modal } from "../../components/root/Modal.jsx";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import moment from "moment";

function WalletList(props) {
  const [walletList, setWalletList] = useState([]); // 전체 지갑 리스트
  const [currentMonth, setCurrentMonth] = useState(); // 현재 월
  const [selectedDate, setSelectedDate] = useState(); // 선택된 날짜
  const [filteredWallet, setFilteredWallet] = useState(walletList); // 필터링된 지갑 리스트
  const [activeTab, setActiveTab] = useState(0); // 카테고리 탭 활성화
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState(new Set()); // 체크된 항목 ID 저장
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/wallet/list").then((res) => setWalletList(res.data));

    // 현재 월 가져오기
    const today = new Date();
    const month = today.toLocaleString("default", { month: "long" }); // 예: "December"
    const year = today.getFullYear(); // 예: 2024
    setCurrentMonth(`${year}년 ${month}`); // 예: "2024년 December"
  }, []);

  // 월별 필터링
  useEffect(() => {
    if (walletList.length > 0 && currentMonth) {
      const filtered = walletList.filter((wallet) => {
        const walletDate = new Date(wallet.date);
        const walletMonthFormatted = `${walletDate.getFullYear()}년 ${walletDate.toLocaleString("default", { month: "long" })}`;
        return walletMonthFormatted === currentMonth;
      });
      setFilteredWallet(filtered); // currentMonth에 맞는 지갑 리스트 필터링
    }
  }, [currentMonth, walletList]); // currentMonth나 walletList가 변경될 때마다 실행

  // 선택된 날짜가 변경될 때 필터링
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString("en-CA");
      const filtered = walletList.filter(
        (wallet) => wallet.date === formattedDate,
      );
      setFilteredWallet(filtered);
    } else {
      setFilteredWallet(walletList); // 날짜 선택 안 하면 전체 내역 표시
    }
  }, [selectedDate, walletList]);

  function ReactCalendar() {
    const currentDate = new Date();
    const [value, onChange] = useState(currentDate);
    const activeDate = moment(value).format("YYYY-MM-DD");
  }

  const prevMonth = () => {
    const newDate = new Date(currentMonth); // 현재 `currentMonth` 기준으로 새 `Date` 객체 생성
    newDate.setMonth(newDate.getMonth() - 1); // 한 달 이전으로 설정
    handleMonthView(newDate); // 해당 월에 맞는 데이터를 갱신
  };

  const nextMonth = () => {
    const newDate = new Date(currentMonth); // 현재 `currentMonth` 기준으로 새 `Date` 객체 생성
    newDate.setMonth(newDate.getMonth() + 1); // 한 달 이후로 설정
    handleMonthView(newDate); // 해당 월에 맞는 데이터를 갱신
  };

  // 월별 보기 버튼 클릭 처리
  const handleMonthView = (date) => {
    const month = date.getMonth(); // 선택된 월
    const year = date.getFullYear(); // 선택된 연도
    const formattedMonth = `${year}년 ${date.toLocaleString("default", { month: "long" })}`;

    setCurrentMonth(formattedMonth); // currentMonth 갱신

    const filtered = walletList.filter((wallet) => {
      const walletDate = new Date(wallet.date);
      return (
        walletDate.getMonth() === month && walletDate.getFullYear() === year
      );
    });
    setFilteredWallet(filtered); // 월별로 필터링된 데이터 표시
  };

  // 전체 날짜 보기
  const handleAllView = () => {
    setFilteredWallet(walletList);
  };

  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
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

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (checkedItems.size === filteredWallet.length) {
      setCheckedItems(new Set()); // 전체 해제
    } else {
      setCheckedItems(new Set(filteredWallet.map((wallet) => wallet.id))); // 전체 선택
    }
  };

  // 선택된 항목의 소비액 합계
  const getTotalSelectedExpense = useMemo(() => {
    return [...checkedItems].reduce((total, id) => {
      const wallet = walletList.find((item) => item.id === id);
      return total + (wallet ? wallet.expense : 0);
    }, 0);
  }, [checkedItems, walletList]);

  // 3자리마다 쉼표 추가
  const formatNumberWithCommas = (number) => {
    return number.toLocaleString(); // 3자리마다 쉼표 추가
  };

  // tileContent 데이터 캐싱
  const tileContentData = useMemo(() => {
    const expenseByDate = walletList.reduce((acc, wallet) => {
      acc[wallet.date] = (acc[wallet.date] || 0) + wallet.expense;
      return acc;
    }, {});
    return expenseByDate;
  }, [walletList]);

  const categories = ["전체", "식비", "교통비", "여가비", "기타"];

  // 카테고리 탭 활성화
  const handleTabClick = (index) => {
    setActiveTab(index);
    if (index === 0) {
      // "전체"
      setFilteredWallet(walletList);
    } else {
      const filtered = walletList.filter(
        (wallet) => wallet.category === categories[index],
      );
      setFilteredWallet(filtered);
    }
  };

  // 카테고리별 지출 합계 계산
  const calculateCategoryTotalExpense = (category) => {
    if (category === "전체") {
      return filteredWallet.reduce(
        (total, wallet) => total + wallet.expense,
        0,
      );
    } else {
      return filteredWallet
        .filter((wallet) => wallet.category === category)
        .reduce((total, wallet) => total + wallet.expense, 0);
    }
  };

  const isCategoryFiltered = activeTab !== 0; // "전체"가 아닌 카테고리가 선택되었을 때만 tfoot 표시

  // 총 지출 계산
  const getTotalExpense = () => {
    return formatNumberWithCommas(
      walletList.reduce((total, wallet) => total + wallet.expense, 0),
    );
  };

  // 총 수입 계산
  const getTotalIncome = () => {
    return formatNumberWithCommas(
      walletList.reduce((total, wallet) => total + wallet.income, 0),
    );
  };

  // 해당 하는 날짜
  const getFilteredDate = () => {
    if (filteredWallet.length > 0) {
      const date = new Date(filteredWallet[0].date); // 첫 번째 항목의 날짜를 Date 객체로 변환
      const year = date.getFullYear(); // 연도
      const month = date.getMonth() + 1; // 월 (0부터 시작하므로 1을 더함)
      const day = date.getDate(); // 일
      return `${year}년 ${month}월 ${day}일`; // 원하는 형식으로 반환
    }
    return ""; // 필터링된 리스트가 없으면 빈 문자열 반환
  };

  // 해당 하는 날짜의 일별 지출 계산
  const getOneDayExpense = () => {
    return filteredWallet.reduce((total, wallet) => total + wallet.expense, 0);
  };

  return (
    <div>
      <Breadcrumb
        depth1={"내 지갑"}
        navigateToDepth1={() => navigate(`/wallet/list`)}
      />

      <aside className={"calendar"}>
        <Calendar
          formatDay={(locale, date) =>
            date.toLocaleString("en", { day: "numeric" })
          }
          showNeighboringMonth={false}
          next2Label={null}
          prev2Label={null}
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={({ date }) => {
            const formattedDate = date.toLocaleDateString("en-CA");
            const totalExpense = tileContentData[formattedDate] || 0;
            return totalExpense > 0 ? (
              <div className={"calendar-badge"}>
                {totalExpense.toLocaleString()}
              </div>
            ) : null;
          }}
        />
      </aside>

      <div className={"middle-section"}>
        <h1>내 지갑</h1>

        <div className={"category-table"}>
          <table>
            <caption>
              <p className={"highlight"}>{currentMonth}</p>
              <br />
              지출 항목별 합계
            </caption>

            {categories.map((category) => (
              <tr key={category}>
                <th>{category}</th>
                <td>
                  {formatNumberWithCommas(
                    calculateCategoryTotalExpense(category),
                  )}
                </td>
                <td>원</td>
              </tr>
            ))}
          </table>
        </div>

        {filteredWallet.length !== walletList.length &&
          filteredWallet.length > 0 && (
            <div className={"category-table"}>
              <table>
                <caption>
                  <p className={"highlight"}>{getFilteredDate()}</p>
                  <br />
                  하루 지출
                </caption>

                <tr>
                  <th>합계</th>
                  <td>{formatNumberWithCommas(getOneDayExpense())}</td>
                  <td>원</td>
                </tr>
              </table>
            </div>
          )}
      </div>

      <div className={"right-section"}>
        <div className={"btn-wrap fixed-list-head-wrap"}>
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
            모든 날짜 보기
          </button>

          <button
            className={"btn btn-dark-outline"}
            style={{ marginLeft: "15px" }}
            onClick={handleMonthView}
          >
            월별 보기
          </button>

          {checkedItems.size > 0 && (
            <div className={"total-expense-wrap"}>
              <p className={"font-bold"}>선택한 지출 합계</p>
              <p>{getTotalSelectedExpense.toLocaleString()}</p>
            </div>
          )}
        </div>

        <div className={"month-wrap"}>
          <ul>
            <li>
              <button type={"button"} onClick={prevMonth}>
                &#10094;
              </button>
            </li>
            <li>
              <h1>{currentMonth}</h1>
            </li>
            <li>
              <button type={"button"} onClick={nextMonth}>
                &#10095;
              </button>
            </li>
          </ul>
        </div>

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

        <table className={"table-list table-total-wrap"}>
          <thead>
            <tr>
              <th>총 수입</th>
              <td>{formatNumberWithCommas(getTotalIncome())}</td>
            </tr>

            <tr>
              <th>총 지출</th>
              <td>{formatNumberWithCommas(getTotalExpense())}</td>
            </tr>
          </thead>
        </table>

        <table className={"table-list wallet-list"}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={checkedItems.size === filteredWallet.length}
                  onChange={handleSelectAll}
                />
              </th>
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
                className={checkedItems.has(wallet.id) ? "checked-row" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={checkedItems.has(wallet.id)}
                    onChange={() => handleCheckboxChange(wallet.id)}
                    onClick={(e) => e.stopPropagation()}
                    className={checkedItems.has(wallet.id)}
                  />
                </td>
                <td>{wallet.date}</td>
                <td>{wallet.category}</td>
                <td>{wallet.title}</td>
                <td>{formatNumberWithCommas(wallet.income)}</td>
                <td>{formatNumberWithCommas(wallet.expense)}</td>
                <td>{wallet.paymentMethod}</td>
                <td>{wallet.memo}</td>
              </tr>
            ))}
          </tbody>

          {/* 전체 보기 상태가 아닐 때만 tfoot 렌더링 */}
          {filteredWallet.length !== walletList.length && (
            <tfoot>
              <tr>
                <th colSpan={4}>{getFilteredDate()}의 지출</th>
                <td colSpan={4}>
                  {formatNumberWithCommas(getOneDayExpense())}
                </td>
              </tr>
            </tfoot>
          )}

          {/* 카테고리별 합계가 필터링된 경우에만 표시 */}
          {isCategoryFiltered && (
            <tfoot className={"table-total-wrap"}>
              <tr>
                <th colSpan={4}>{categories[activeTab]} 지출 합계</th>
                <td colSpan={4}>
                  {formatNumberWithCommas(
                    calculateCategoryTotalExpense(categories[activeTab]),
                  )}
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
