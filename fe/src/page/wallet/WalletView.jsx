import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";

function WalletView(props) {
  const { id } = useParams();
  const [wallet, setWallet] = useState(null); // 초기값을 null로 설정

  useEffect(() => {
    axios
      .get(`/api/wallet/view/${id}`)
      .then((res) => {
        setWallet(res.data); // 올바르게 data를 set
      })
      .catch();
  }, [id]);

  if (wallet === null) {
    return <Spinner />;
  }

  return (
    <div className={"body"}>
      <div>
        <button>수정</button>
        <button>삭제</button>
        <button>저장</button>
      </div>

      <form>
        <table>
          <tbody>
            <tr>
              <th>날짜</th>
              <td>
                <input readOnly value={wallet.date} />
              </td>
            </tr>

            <tr>
              <th>항목</th>
              <td>
                <input readOnly value={wallet.category} />
              </td>
            </tr>

            <tr>
              <th>사용처</th>
              <td>
                <input readOnly value={wallet.title} />
              </td>
            </tr>

            <tr>
              <th>수입</th>
              <td>
                <input readOnly value={wallet.income} />
              </td>
            </tr>

            <tr>
              <th>지출</th>
              <td>
                <input readOnly value={wallet.expense} />
              </td>
            </tr>

            <tr>
              <th>지출 방식</th>
              <td>
                <input readOnly value={wallet.paymentMethod} />
              </td>
            </tr>

            <tr>
              <th>메모</th>
              <td>
                <textarea readOnly value={wallet.memo}></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default WalletView;
