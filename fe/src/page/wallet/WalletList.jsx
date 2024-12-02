import React, { useEffect, useState } from "react";
import axios from "axios";

function WalletList(props) {
  const [walletList, setWalletList] = useState([]);

  useEffect(() => {
    axios.get("/api/wallet/list").then((res) => setWalletList(res.data));
  }, []);

  return (
    <div>
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
          {walletList.map((wallet) => (
            <tr key={wallet.id}>
              <td>{wallet.date}</td>
              <td>{wallet.category}</td>
              <td>{wallet.title}</td>
              <td>{wallet.income}</td>
              <td>{wallet.expense}</td>
              <td></td>
              <td>{wallet.paymentMethod}</td>
              <td>{wallet.memo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WalletList;
