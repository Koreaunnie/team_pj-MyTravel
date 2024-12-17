import { formatNumberWithCommas } from "../../components/utils/FormatNumberWithCommas.jsx";
import React from "react";

export function WalletCategory({
  filteredWallet,
  categories,
  getFilteredDate,
}) {
  const calculateFilteredDateTotalExpenseByCategory = (category) => {
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

  return (
    <div>
      {filteredWallet.length === 0 ? (
        <div className={"empty-container"}>
          <p className={"empty-container-title"}>
            {getFilteredDate()}은
            <br />
            지출 내역이 없습니다.
          </p>
        </div>
      ) : (
        <div className={"category-table"}>
          <table>
            <caption>
              <p className={"highlight"}>{getFilteredDate()}</p>
              <br />
              지출 항목별 합계
            </caption>

            {categories.map((category) => (
              <tr key={category}>
                <th>{category}</th>
                <td>
                  {formatNumberWithCommas(
                    calculateFilteredDateTotalExpenseByCategory(category),
                  )}
                </td>
                <td>원</td>
              </tr>
            ))}
          </table>
        </div>
      )}
    </div>
  );
}
