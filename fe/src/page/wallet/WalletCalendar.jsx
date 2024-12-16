import React from "react";
import Calendar from "react-calendar";
import moment from "moment/moment.js";

export function WalletCalendar({
  selectedDate,
  setSelectedDate,
  setCurrentMonth,
  setCurrentYear,
  tileContentData,
}) {
  const getCurrentMonth = (activeStartDate) => {
    const newCurrentMonth = moment(activeStartDate).format("YYYY년 M월");
    setCurrentMonth(newCurrentMonth);
    setCurrentYear(activeStartDate.getFullYear());
  };

  return (
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
        onActiveStartDateChange={({ activeStartDate }) =>
          getCurrentMonth(activeStartDate)
        }
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
  );
}
